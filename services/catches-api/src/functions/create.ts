import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import * as uuid from "uuid";

export const create: APIGatewayProxyHandlerV2 = async (event) => {
  const dynamoDb = new DynamoDB({
    endpoint: process.env.DYNAMODB_ENDPOINT,
    region: process.env.AWS_REGION,
  });
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body!);
  const params = {
    TableName: process.env.DYNAMODB_TABLE!,
    Item: marshall({
      ...data,
      id: uuid.v4(),
      created_at: timestamp,
      updated_at: timestamp,
    }),
  };

  try {
    // write the catch to the database
    await dynamoDb.putItem(params);
    // create a response
    return {
      statusCode: 200,
      body: JSON.stringify(unmarshall(params.Item)),
    };

  } catch (error) {
    console.error(error);
    throw new Error("Couldn't create the catch item.")
  }
};
