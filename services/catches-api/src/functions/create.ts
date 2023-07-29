import { APIGatewayProxyHandlerV2 } from 'aws-lambda'
import { DynamoDB, PutItemOutput } from '@aws-sdk/client-dynamodb';
import * as uuid from "uuid";

export const create: APIGatewayProxyHandlerV2 = (
  event,
  context,
  callback
) => {
  const dynamoDb = new DynamoDB({});
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
  dynamoDb.putItem(params, (error: any, result: PutItemOutput | undefined) => {
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
