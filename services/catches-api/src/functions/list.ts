import AWS, { AWSError } from "aws-sdk";
import { ScanOutput } from "aws-sdk/clients/dynamodb";

export const list: AWSLambda.APIGatewayProxyHandlerV2 = (
  event,
  context,
  callback
) => {
  const dynamoDb = new AWS.DynamoDB.DocumentClient();
  const params = {
    TableName: process.env.DYNAMODB_TABLE!,
  };
  // fetch all catches from the database
  dynamoDb.scan(params, (error: AWSError, result: ScanOutput) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { "Content-Type": "text/plain" },
        body: "Couldn't fetch the catch items.",
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
    callback(null, response);
  });
};
