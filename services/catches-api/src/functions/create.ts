import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDB, PutItemOutput } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import * as uuid from "uuid";

export const create: APIGatewayProxyHandlerV2 = (event, context, callback) => {
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

  // write the catch to the database
  dynamoDb.putItem(
    params as any,
    (error: any, result: PutItemOutput | undefined) => {
      // handle potential errors
      if (error) {
        console.error(error);
        callback(new Error("Couldn't create the catch item."));
        return;
      }

      // create a response
      const response = {
        statusCode: 200,
        body: JSON.stringify(unmarshall(params.Item)),
      };
      callback(null, response);
    },
  );
};
