import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { convertToAttr, unmarshall } from "@aws-sdk/util-dynamodb";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const dynamoDb = new DynamoDB({
    endpoint: process.env.DYNAMODB_ENDPOINT,
    region: process.env.AWS_REGION,
  });
  const params = {
    TableName: process.env.DYNAMODB_TABLE!,
    Key: {
      id: convertToAttr(event.pathParameters!.id!),
    },
  };

  try {
    // fetch media from the database
    const result = await dynamoDb.getItem(params);
    const item = unmarshall(result.Item!);
    const s3Client = new S3Client({
      endpoint: process.env.S3_ENDPOINT,
      region: process.env.AWS_REGION,
      forcePathStyle: !!process.env.S3_ENDPOINT,
    });
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: item.key,
      ResponseContentDisposition: `attachment; filename="${item.name}"`,
    });
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        ...item,
        last_modified: new Date(item.last_modified).toISOString(),
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
