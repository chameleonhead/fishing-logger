import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { convertToAttr, unmarshall } from "@aws-sdk/util-dynamodb";

export const update: APIGatewayProxyHandlerV2 = async (event) => {
  const dynamoDb = new DynamoDB({
    endpoint: process.env.DYNAMODB_ENDPOINT,
    region: process.env.AWS_REGION,
  });
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body!);

  // validation
  if (typeof event.pathParameters!.id === "undefined") {
    console.error("Validation Failed");
    return {
      statusCode: 400,
      headers: { "Content-Type": "text/plain" },
      body: "Couldn't update the catch item.",
    };
  }

  const entries = Object.entries(data)
    .filter(([key]) => !["id", "created_at", "updated_at"].includes(key))
    .map(([key, value], i) => ({ attr: `#attr${i}`, key, value }));

  const params = {
    TableName: process.env.DYNAMODB_TABLE!,
    Key: {
      id: convertToAttr(event.pathParameters!.id),
    },
    ExpressionAttributeNames: {
      ...entries.reduce((prev, { attr, key }) => {
        prev[attr] = key;
        return prev;
      }, {} as any),
    },
    ExpressionAttributeValues: {
      ...entries.reduce((prev, { key, value }) => {
        prev[":" + key] = convertToAttr(value);
        return prev;
      }, {} as any),
      ":updated_at": convertToAttr(timestamp),
    },
    UpdateExpression:
      "SET " +
      entries.map(({ attr, key }) => `${attr} = :${key}`).join(", ") +
      ", updated_at = :updated_at",
    ReturnValues: "ALL_NEW",
  } as any;

  try {
    // update the catch in the database
    const result = await dynamoDb.updateItem(params);

    // create a response
    return {
      statusCode: 200,
      body: JSON.stringify(unmarshall(result.Attributes!)),
    };

  } catch (error: any) {
    console.error(error);
    return {
      statusCode: error.statusCode || 501,
      headers: { "Content-Type": "text/plain" },
      body: "Couldn't fetch the catch item.",
    };

  }
};
