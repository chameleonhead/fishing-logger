import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const dynamoDb = new DynamoDB({
    endpoint: process.env.DYNAMODB_ENDPOINT,
    region: process.env.AWS_REGION,
  });
  const params = {
    TableName: process.env.DYNAMODB_TABLE!,
  };

  // fetch all catches from the database
  const result = await dynamoDb.scan(params)

  // create a response
  return {
    statusCode: 200,
    body: JSON.stringify({
      catches: result.Items?.map((item) => unmarshall(item as any)),
    }),
  };
};
