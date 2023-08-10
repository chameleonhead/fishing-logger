import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { convertToAttr, unmarshall } from "@aws-sdk/util-dynamodb";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const dynamoDb = new DynamoDB({
    endpoint: process.env.DYNAMODB_ENDPOINT,
    region: process.env.AWS_REGION,
  });
  const params = {
    TableName: process.env.DYNAMODB_TABLE!,
    Key: {
      id: convertToAttr(event.pathParameters!.id),
    },
  };

  // fetch catch from the database
  const result = await dynamoDb.getItem(params)

  if (!result.Item) {
    return {
      statusCode: 404,
      headers: { "Content-Type": "text/plain" },
      body: "Catch not found.",
    };
  }

  // create a response
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(unmarshall(result!.Item)),
  };
};
