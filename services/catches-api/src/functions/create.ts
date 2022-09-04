import * as uuid from "uuid";

import AWS from "aws-sdk";

const { DynamoDB } = AWS;

const dynamoDb = new DynamoDB.DocumentClient();

export const create: AWSLambda.APIGatewayProxyHandlerV2 = (
  event,
  context,
  callback
) => {
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
  dynamoDb.put(params, (error, result) => {
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
