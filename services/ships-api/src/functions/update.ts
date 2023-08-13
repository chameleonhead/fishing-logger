import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { AttributeValue, DynamoDB } from "@aws-sdk/client-dynamodb";
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
  const result = await dynamoDb.getItem(params);

  if (!result.Item) {
    return {
      statusCode: 404,
      headers: { "Content-Type": "text/plain" },
      body: "Catch not found.",
    };
  }

  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body!);

  // validation
  if (typeof event.pathParameters!.id === "undefined") {
    console.error("Validation Failed");
    return {
      statusCode: 400,
      headers: { "Content-Type": "text/plain" },
      body: "Couldn't update the ship item.",
    };
  }

  const entries = Object.entries(data)
    .filter(([key]) => !["id", "created_at", "updated_at"].includes(key))
    .map(([key, value], i) => ({ attr: `#attr${i}`, key, value }));

  const paramsUpdate = {
    TableName: process.env.DYNAMODB_TABLE!,
    Key: {
      id: convertToAttr(event.pathParameters!.id),
    },
    ExpressionAttributeNames: {
      ...entries.reduce(
        (prev, { attr, key }) => {
          prev[attr] = key;
          return prev;
        },
        {} as Record<string, string>,
      ),
    },
    ExpressionAttributeValues: {
      ...entries.reduce(
        (prev, { key, value }) => {
          prev[":" + key] = convertToAttr(value);
          return prev;
        },
        {} as Record<string, AttributeValue>,
      ),
      ":updated_at": convertToAttr(timestamp),
    },
    UpdateExpression:
      "SET " +
      entries.map(({ attr, key }) => `${attr} = :${key}`).join(", ") +
      ", updated_at = :updated_at",
    ReturnValues: "ALL_NEW",
  };

  // update the ship in the database
  const resultUpdate = await dynamoDb.updateItem(paramsUpdate);

  // create a response
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(unmarshall(resultUpdate.Attributes!)),
  };
};
