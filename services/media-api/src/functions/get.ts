import AWS from "aws-sdk";

export const get: AWSLambda.APIGatewayProxyHandlerV2 = async (
  event,
  context
) => {
  const dynamoDb = new AWS.DynamoDB.DocumentClient();
  const s3 = new AWS.S3();
  const params = {
    TableName: process.env.DYNAMODB_TABLE!,
    Key: {
      id: event.pathParameters!.id,
    },
  };

  try {
    // fetch media from the database
    const result = await dynamoDb.get(params).promise();

    const signedUrl = await s3.getSignedUrl("getObject", {
      Bucket: process.env.S3_BUCKET!,
      Key: result.Item?.Key,
    });
    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        ...result.Item,
        lastModified: new Date(result.Item?.lastModified).toISOString(),
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
