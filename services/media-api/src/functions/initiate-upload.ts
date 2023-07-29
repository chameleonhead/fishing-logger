import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDB, PutItemOutput } from "@aws-sdk/client-dynamodb";
import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import * as uuid from "uuid";

export const initiateUpload: APIGatewayProxyHandlerV2 = (
  event,
  context,
  callback
) => {
  const dynamoDb = new DynamoDB({});
  const s3 = new S3Client({});
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body!);

  const id = uuid.v4();
  const uploadKey = "uploads/" + id;
  createPresignedPost(
    s3,
    {
      Bucket: process.env.S3_BUCKET!,
      Key: uploadKey,
      Fields: {
      },
    }).then(result => {
      const params = {
        TableName: process.env.DYNAMODB_TABLE!,
        Item: {
          id: uploadKey,
          data: {
            ...data,
            id: uuid.v4(),
          },
          url: result.url,
          fields: result.fields,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      };

      // write the catch to the database
      dynamoDb.putItem(params as any, (error: any, result: PutItemOutput | undefined) => {
        // handle potential errors
        if (error) {
          console.error(error);
          callback(new Error("Couldn't create the catch item."));
          return;
        }

        // create a response
        const response = {
          statusCode: 200,
          body: JSON.stringify(params.Item),
        };
        callback(null, response);
      });

    }).catch((error) => {
      console.error(error);
      callback(new Error("Couldn't start upload."));
    });
};
