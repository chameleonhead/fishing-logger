import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDB, GetItemCommandOutput, UpdateItemOutput } from "@aws-sdk/client-dynamodb";

export const addMedia: APIGatewayProxyHandlerV2 = (
  event,
  context,
  callback
) => {
  const dynamoDb = new DynamoDB({});
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body!);
  const params = {
    TableName: process.env.DYNAMODB_TABLE!,
    Key: {
      id: event.pathParameters!.id,
    },
  } as any

  // fetch catch from the database
  dynamoDb.getItem(params, (error: any, result: GetItemCommandOutput | undefined) => {
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

    const params = {
      TableName: process.env.DYNAMODB_TABLE!,
      Key: {
        id: event.pathParameters!.id,
      },
      ExpressionAttributeValues: {
        ":media": (result!.Item?.media.SS || []).concat([data]),
        ":updatedAt": timestamp,
      },
      UpdateExpression: "SET media = :media, updatedAt = :updatedAt",
      ReturnValues: "ALL_NEW",
    } as any;

    // update the catch in the database
    dynamoDb.updateItem(params, (error: any, result: UpdateItemOutput | undefined) => {
      // handle potential errors
      if (error) {
        console.error(error);
        callback(null, {
          statusCode: error.statusCode || 501,
          headers: { "Content-Type": "text/plain" },
          body: "Couldn't update the catch item.",
        });
        return;
      }

      // create a response
      const response = {
        statusCode: 200,
        body: JSON.stringify(result!.Attributes),
      };
      callback(null, response);
    });
  });
};
