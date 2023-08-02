import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { S3 } from "@aws-sdk/client-s3";
import { convertToAttr, marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { S3Handler } from "aws-lambda";
import * as uuid from "uuid";

export const onUploadCompleted: S3Handler = async (
  event,
  context,
  callback,
) => {
  const dynamoDb = new DynamoDB({
    endpoint: process.env.DYNAMODB_ENDPOINT,
    region: process.env.AWS_REGION,
  });
  const s3 = new S3({
    endpoint: process.env.S3_ENDPOINT,
    region: process.env.AWS_REGION,
    forcePathStyle: !!process.env.S3_ENDPOINT,
  });
  const timestamp = new Date().getTime();
  console.log(`processing ${event.Records.length} records.`);
  const errors = [] as Error[];
  for (const data of event.Records) {
    try {
      const result = await dynamoDb.getItem({
        TableName: process.env.DYNAMODB_TABLE!,
        Key: {
          id: convertToAttr(data.s3.object.key),
        },
      });
      const item = unmarshall(result.Item!);

      if (item.status === "processed") {
        console.log(`Item ${data.s3.object.key} is already processed.`);
        continue;
      }
      if (
        typeof item.data === "undefined" ||
        typeof item.data.id !== "string"
      ) {
        console.error(
          `Couldn't process item ${data.s3.object.key} because data or data.id not found.`,
        );
        errors.push(
          new Error(
            `Couldn't process item ${data.s3.object.key} because data or data.id not found.`,
          ),
        );
        continue;
      }

      const Key = "media/" + item.data.id;
      const media = {
        ...item.data,
        key: Key,
        created_at: timestamp,
        updated_at: timestamp,
      } as any;
      try {
        const headObjectResult = await s3.headObject({
          Bucket: data.s3.bucket.name,
          Key: data.s3.object.key,
        });

        if (typeof media.id !== "string") {
          media.id = uuid.v4();
        }
        if (typeof media.content_type !== "string" || !media.content_type) {
          media.content_type = "application/octet-stream";
        }
        if (typeof media.size !== "number") {
          media.size = headObjectResult.ContentLength;
        }
        if (typeof media.last_modified !== "number") {
          media.last_modified =
            headObjectResult.LastModified?.getTime() || Date.now();
        }

        await s3.copyObject({
          Bucket: process.env.S3_BUCKET!,
          Key: Key,
          ContentType: media.content_type,
          CopySource: `/${data.s3.bucket.name}/${data.s3.object.key}`,
        });
      } catch (error) {
        console.error(
          `Couldn't copy object from /${data.s3.bucket.name}/${data.s3.object.key} to ${data.s3.object.key}.`,
        );
        console.error(error);
        errors.push(
          new Error(
            `Couldn't copy object from /${data.s3.bucket.name}/${data.s3.object.key} to ${data.s3.object.key}.`,
          ),
        );
        continue;
      }

      try {
        await dynamoDb.putItem({
          TableName: process.env.DYNAMODB_TABLE!,
          Item: marshall(media),
        });
      } catch (error) {
        console.error(`Couldn't create the media item.`);
        console.error(error);
        errors.push(new Error(`Couldn't create the media item.`));
        continue;
      }

      try {
        await s3.deleteObject({
          Bucket: data.s3.bucket.name,
          Key: data.s3.object.key,
        });
        await dynamoDb.deleteItem({
          TableName: process.env.DYNAMODB_TABLE!,
          Key: {
            id: convertToAttr(data.s3.object.key),
          },
        } as any);
      } catch (error) {
        console.error(
          `Couldn't delete item ${data.s3.object.key} upload status.`,
        );
        console.error(error);
        errors.push(
          new Error(
            `Couldn't delete item ${data.s3.object.key} upload status.`,
          ),
        );
        continue;
      }
    } catch (error) {
      console.error(`Couldn't get item ${data.s3.object.key}.`);
      console.error(error);
      errors.push(new Error(`Couldn't get item ${data.s3.object.key}.`));
      continue;
    }
  }
  callback(errors.length > 0 ? errors[0] : null);
};
