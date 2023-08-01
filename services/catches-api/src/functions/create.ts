import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDB, PutItemOutput } from "@aws-sdk/client-dynamodb";
import * as uuid from "uuid";
import { convertFromItem, convertToItem } from "../shared/dynamodb-utils";

export const create: APIGatewayProxyHandlerV2 = (event, context, callback) => {
  const dynamoDb = new DynamoDB({
    endpoint: process.env.DYNAMODB_ENDPOINT,
    region: process.env.AWS_REGION,
  });
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body!);
  const params = {
    TableName: process.env.DYNAMODB_TABLE!,
    Item: convertToItem({
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
        body: JSON.stringify(convertFromItem(params.Item)),
      };
      callback(null, response);
    },
  );
};
