import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import * as uuid from "uuid";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const dynamoDb = new DynamoDB({
    endpoint: process.env.DYNAMODB_ENDPOINT,
    region: process.env.AWS_REGION,
  });
  const s3 = new S3Client({
    endpoint: process.env.S3_ENDPOINT,
    region: process.env.AWS_REGION,
    forcePathStyle: !!process.env.S3_ENDPOINT,
  });
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body!);

  const id = uuid.v4();
  const uploadKey = "uploads/" + id;

  try {
    const result = await createPresignedPost(s3, {
      Bucket: process.env.S3_BUCKET!,
      Key: uploadKey,
    });

    const params = {
      TableName: process.env.DYNAMODB_TABLE!,
      Item: marshall({
        id: uploadKey,
        data: {
          ...data,
          id: uuid.v4(),
        },
        url: result.url,
        fields: result.fields,
        created_at: timestamp,
        updated_at: timestamp,
      }),
    };

    // write the catch to the database
    await dynamoDb.putItem(params);

    // create a response
    return {
      statusCode: 200,
      body: JSON.stringify(unmarshall(params.Item)),
    };

  } catch (error: any) {
    console.error(error);
    throw new Error("Couldn't start upload.");
  }
};
