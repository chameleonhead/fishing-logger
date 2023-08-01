import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDB, GetItemOutput } from "@aws-sdk/client-dynamodb";
import { convertToAttr, unmarshall } from "@aws-sdk/util-dynamodb";

export const get: APIGatewayProxyHandlerV2 = (event, context, callback) => {
  const dynamoDb = new DynamoDB({
    endpoint: process.env.DYNAMODB_ENDPOINT,
    region: process.env.AWS_REGION,
  });
  const params = {
    TableName: process.env.DYNAMODB_TABLE!,
    Key: {
      id: convertToAttr(event.pathParameters!.id),
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

    if (!result?.Item) {
      const response = {
        statusCode: 404,
        headers: { "Content-Type": "text/plain" },
        body: "Catch item not found.",
      };
      callback(null, response);
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(unmarshall(result!.Item as any)),
    };
    callback(null, response);
  });
};
