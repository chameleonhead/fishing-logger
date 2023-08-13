import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import {
  convertToAttr,
  convertToNative,
  unmarshall,
} from "@aws-sdk/util-dynamodb";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const dynamoDb = new DynamoDB({
    endpoint: process.env.DYNAMODB_ENDPOINT,
    region: process.env.AWS_REGION,
  });
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body!);
  const params = {
    TableName: process.env.DYNAMODB_TABLE!,
    Key: {
      id: convertToAttr(event.pathParameters!.id),
    },
  };

  // fetch catch from the database
  const result = await dynamoDb.getItem(params);

  const paramsUpdate = {
    TableName: process.env.DYNAMODB_TABLE!,
    Key: {
      id: convertToAttr(event.pathParameters!.id),
    },
    ExpressionAttributeValues: {
      ":media": convertToAttr(
        convertToNative(result!.Item?.media || { L: [] }).concat([data]),
      ),
      ":updated_at": convertToAttr(timestamp),
    },
    UpdateExpression: "SET media = :media, updated_at = :updated_at",
    ReturnValues: "ALL_NEW",
  };

  // update the catch in the database
  const updateResult = await dynamoDb.updateItem(paramsUpdate);

  // create a response
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(unmarshall(updateResult!.Attributes!)),
  };
};
