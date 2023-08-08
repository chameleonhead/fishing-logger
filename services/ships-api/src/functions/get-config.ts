import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { convertToAttr, unmarshall } from "@aws-sdk/util-dynamodb";
import { getIotConfigurations } from "../lib/iot-utils";

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
  if (!ship.iot_enabled) {
    return {
      statusCode: 404,
      headers: { "Content-Type": "text/plain" },
      body: "Ship not activated.",
    };
  }

  const config = await getIotConfigurations();
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(config),
  };
};
