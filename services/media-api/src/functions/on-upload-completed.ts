import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { S3 } from "@aws-sdk/client-s3";
import { S3Handler } from "aws-lambda";
import * as uuid from "uuid";

export const onUploadCompleted: S3Handler = async (
  event,
  context,
  callback
) => {
  const dynamoDb = new DynamoDB({});
  const s3 = new S3({});
  const timestamp = new Date().getTime();
  console.log(`processing ${event.Records.length} records.`);
  const errors = [] as Error[];
  for (const data of event.Records) {
    try {
      const result = await dynamoDb
        .getItem({
          TableName: process.env.DYNAMODB_TABLE!,
          Key: {
            id: data.s3.object.key,
          },
        } as any);

      if (result.Item?.status.S === "processed") {
        console.log(`Item ${data.s3.object.key} is already processed.`);
        continue;
      }
      if (
        typeof result.Item?.data === "undefined" ||
        typeof result.Item.data.M?.id.S !== "string"
      ) {
        console.error(
          `Couldn't process item ${data.s3.object.key} because data or data.id not found.`
        );
        errors.push(
          new Error(
            `Couldn't process item ${data.s3.object.key} because data or data.id not found.`
          )
        );
        continue;
      }

      const Key = "media/" + result.Item.data.M?.id.S;
      const item = {
        ...result.Item.data.M,
        Key: Key,
        createdAt: timestamp,
        updatedAt: timestamp,
      } as any;
      try {
        const headObjectResult = await s3
          .headObject({
            Bucket: data.s3.bucket.name,
            Key: data.s3.object.key,
          });

        if (typeof item.M.id.S !== "string") {
          item.id = uuid.v4();
        }
        if (typeof item.contentType !== "string" || !item.contentType) {
          item.contentType = "application/octet-stream";
        }
        if (typeof item.size !== "number") {
          item.size = headObjectResult.ContentLength;
        }
        if (typeof item.lastModified !== "number") {
          item.lastModified =
            headObjectResult.LastModified?.getTime() || Date.now();
        }

        await s3
          .copyObject({
            Bucket: process.env.S3_BUCKET!,
            Key: Key,
            ContentType: item.contentType,
            CopySource: `/${data.s3.bucket.name}/${data.s3.object.key}`,
          });
      } catch (error) {
        console.error(
          `Couldn't copy object from /${data.s3.bucket.name}/${data.s3.object.key} to ${data.s3.object.key}.`
        );
        console.error(error);
        errors.push(
          new Error(
            `Couldn't copy object from /${data.s3.bucket.name}/${data.s3.object.key} to ${data.s3.object.key}.`
          )
        );
        continue;
      }

      try {
        await dynamoDb
          .putItem({
            TableName: process.env.DYNAMODB_TABLE!,
            Item: item,
          });
      } catch (error) {
        console.error(`Couldn't create the media item.`);
        console.error(error);
        errors.push(new Error(`Couldn't create the media item.`));
        continue;
      }

      try {
        await s3
          .deleteObject({
            Bucket: data.s3.bucket.name,
            Key: data.s3.object.key,
          });
        await dynamoDb
          .deleteItem({
            TableName: process.env.DYNAMODB_TABLE!,
            Key: {
              id: data.s3.object.key,
            },
          } as any);
      } catch (error) {
        console.error(
          `Couldn't delete item ${data.s3.object.key} upload status.`
        );
        console.error(error);
        errors.push(
          new Error(`Couldn't delete item ${data.s3.object.key} upload status.`)
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
