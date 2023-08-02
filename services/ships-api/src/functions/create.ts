import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { convertToAttr } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import * as uuid from "uuid";

export const create: APIGatewayProxyHandlerV2 = async (event) => {
  const dynamoDb = new DynamoDB({
    endpoint: process.env.DYNAMODB_ENDPOINT,
    region: process.env.AWS_REGION
  });
  const timestamp = new Date().getTime();
  const body = JSON.parse(event.body!);
  const id = uuid.v4();
  await dynamoDb.putItem({
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id: convertToAttr(id),
      name: convertToAttr(body.name),
      iot_enabled: convertToAttr(false),
      created_at: convertToAttr(timestamp),
      updated_at: convertToAttr(timestamp),
    }
  });
  return {
    statusCode: 200,
    body: JSON.stringify({ id }),
  }
};
