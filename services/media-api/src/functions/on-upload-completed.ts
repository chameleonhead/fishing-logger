import AWS from "aws-sdk";

export const onUploadCompleted: AWSLambda.S3Handler = async (
  event,
  context,
  callback
) => {
  const dynamoDb = new AWS.DynamoDB.DocumentClient();
  const s3 = new AWS.S3();
  const timestamp = new Date().getTime();
  console.log(`processing ${event.Records.length} records.`);
  const errors = [] as Error[];
  for (const data of event.Records) {
    try {
      const result = await dynamoDb
        .get({
          TableName: process.env.DYNAMODB_TABLE!,
          Key: {
            id: data.s3.object.key,
          },
        })
        .promise();

      if (result.Item?.status === "processed") {
        console.log(`Item ${data.s3.object.key} is already processed.`);
        continue;
      }
      if (
        typeof result.Item?.data === "undefined" ||
        typeof result.Item.data.id !== "string"
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

      const Key = "media/" + result.Item.data.id;
      try {
        await s3
          .copyObject({
            Bucket: process.env.S3_BUCKET!,
            Key: Key,
            CopySource: `/${data.s3.bucket.name}/${data.s3.object.key}`,
          })
          .promise();
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
          .put({
            TableName: process.env.DYNAMODB_TABLE!,
            Item: {
              ...result.Item.data,
              Key: Key,
              createdAt: timestamp,
              updatedAt: timestamp,
            },
          })
          .promise();
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
          })
          .promise();
        await dynamoDb
          .delete({
            TableName: process.env.DYNAMODB_TABLE!,
            Key: {
              id: data.s3.object.key,
            },
          })
          .promise();
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
