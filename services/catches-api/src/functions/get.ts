import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDB, GetItemOutput } from "@aws-sdk/client-dynamodb";

export const get: APIGatewayProxyHandlerV2 = (
  event,
  context,
  callback
) => {
  const dynamoDb = new DynamoDB({});
  const params = {
    TableName: process.env.DYNAMODB_TABLE!,
    Key: {
      id: event.pathParameters!.id,
    },
  } as any;

  // fetch catch from the database
  dynamoDb.getItem(params, (error: any, result: GetItemOutput | undefined) => {
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
      body: JSON.stringify(result!.Item),
    };
    callback(null, response);
  });
};
