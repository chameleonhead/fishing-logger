import AWS, { AWSError } from "aws-sdk";
import { UpdateItemOutput } from "aws-sdk/clients/dynamodb";

export const update: AWSLambda.APIGatewayProxyHandlerV2 = (
  event,
  context,
  callback
) => {
  const dynamoDb = new AWS.DynamoDB.DocumentClient();
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body!);

  // validation
  if (typeof event.pathParameters!.id === "undefined") {
    console.error("Validation Failed");
    callback(null, {
      statusCode: 400,
      headers: { "Content-Type": "text/plain" },
      body: "Couldn't update the catch item.",
    });
    return;
  }

  const entries = Object.entries(data)
    .filter(([key]) => !["id", "createdAt", "updatedAt"].includes(key))
    .map(([key, value], i) => ({ attr: `#attr${i}`, key, value }));

  const params = {
    TableName: process.env.DYNAMODB_TABLE!,
    Key: {
      id: event.pathParameters!.id,
    },
    ExpressionAttributeNames: {
      ...entries.reduce((prev, { attr, key }) => {
        prev[attr] = key;
        return prev;
      }, {} as any),
    },
    ExpressionAttributeValues: {
      ...entries.reduce((prev, { key, value }) => {
        prev[":" + key] = value;
        return prev;
      }, {} as any),
      ":updatedAt": timestamp,
    },
    UpdateExpression:
      "SET " +
      entries.map(({ attr, key }) => `${attr} = :${key}`).join(", ") +
      ", updatedAt = :updatedAt",
    ReturnValues: "ALL_NEW",
  };

  // update the catch in the database
  dynamoDb.update(params, (error: AWSError, result: UpdateItemOutput) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { "Content-Type": "text/plain" },
        body: "Couldn't fetch the catch item.",
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    };
    callback(null, response);
  });
};
