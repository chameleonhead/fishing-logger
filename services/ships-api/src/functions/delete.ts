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

  // fetch ship from the database
  const result = await dynamoDb.getItem(params)

  if (!result.Item) {
    return {
      statusCode: 404,
      headers: { "Content-Type": "text/plain" },
      body: "Ship not found.",
    };
  }

  // create a response
  const ship = unmarshall(result!.Item!);

  if (typeof ship.iot_config !== 'undefined') {
    return {
      statusCode: 400,
      headers: { "Content-Type": "text/plain" },
      body: "Ship is registered to IoT.",
    };
  }

  await dynamoDb.deleteItem(params);

  return {
    statusCode: 204,
    body: JSON.stringify(ship),
  };
};
