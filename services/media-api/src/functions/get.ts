import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export const get: APIGatewayProxyHandlerV2 = async (
  event,
  context
) => {
  const dynamoDb = new DynamoDB({});
  const params = {
    TableName: process.env.DYNAMODB_TABLE!,
    Key: {
      id: {
        S: event.pathParameters!.id!,
      }
    },
  };

  try {
    // fetch media from the database
    const result = await dynamoDb.getItem(params);
    const s3Client = new S3Client({});
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: result.Item!.Key!.S,
      ResponseContentDisposition: `attachment; filename="${result.Item?.name}"`,
    });
    const signedUrl = getSignedUrl(s3Client, command, { expiresIn: 3600 });
    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        ...result.Item,
        last_modified: new Date(Number(result.Item!.last_modified!.N)).toISOString(),
        url: signedUrl,
      }),
    };
    return response;
  } catch (error: any) {
    console.error(error);
    return {
      statusCode: error.statusCode || 501,
      headers: { "Content-Type": "text/plain" },
      body: "Couldn't fetch the media item.",
    };
  }
};
