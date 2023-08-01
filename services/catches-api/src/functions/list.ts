import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDB, ScanOutput } from "@aws-sdk/client-dynamodb";
import { convertFromItem } from "../shared/dynamodb-utils";

export const list: APIGatewayProxyHandlerV2 = (event, context, callback) => {
  const dynamoDb = new DynamoDB({
    endpoint: process.env.DYNAMODB_ENDPOINT,
    region: process.env.AWS_REGION,
  });
  const params = {
    TableName: process.env.DYNAMODB_TABLE!,
  };
  // fetch all catches from the database
  dynamoDb.scan(params, (error: any, result: ScanOutput | undefined) => {
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
      body: JSON.stringify({
        items: result!.Items?.map((item) => convertFromItem(item as any)),
      }),
    };
    callback(null, response);
  });
};
