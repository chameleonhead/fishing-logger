import * as uuid from "uuid";
import AWS, { AWSError } from "aws-sdk";
import { PutItemOutput } from "aws-sdk/clients/dynamodb";

export const create: AWSLambda.APIGatewayProxyHandlerV2 = (
  event,
  context,
  callback
) => {
  const dynamoDb = new AWS.DynamoDB.DocumentClient();
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body!);
  const params = {
    TableName: process.env.DYNAMODB_TABLE!,
    Item: {
      ...data,
      id: uuid.v4(),
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  };

  // write the catch to the database
  dynamoDb.put(params, (error: AWSError, result: PutItemOutput) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(new Error("Couldn't create the catch item."));
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    };
    callback(null, response);
  });
};
