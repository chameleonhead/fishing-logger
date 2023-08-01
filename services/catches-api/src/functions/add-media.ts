import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import {
  DynamoDB,
  GetItemCommandOutput,
  UpdateItemOutput,
} from "@aws-sdk/client-dynamodb";
import {
  convertFromAttributeValue,
  convertFromItem,
  convertToAttributeValue,
} from "../shared/dynamodb-utils";

export const addMedia: APIGatewayProxyHandlerV2 = (
  event,
  context,
  callback,
) => {
  const dynamoDb = new DynamoDB({
    endpoint: process.env.DYNAMODB_ENDPOINT,
    region: process.env.AWS_REGION,
  });
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body!);
  const params = {
    TableName: process.env.DYNAMODB_TABLE!,
    Key: {
      id: convertToAttributeValue(event.pathParameters!.id),
    },
  } as any;

  // fetch catch from the database
  dynamoDb.getItem(
    params,
    (error: any, result: GetItemCommandOutput | undefined) => {
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

      try {
        const params = {
          TableName: process.env.DYNAMODB_TABLE!,
          Key: {
            id: convertToAttributeValue(event.pathParameters!.id),
          },
          ExpressionAttributeValues: {
            ":media": convertToAttributeValue(
              convertFromAttributeValue(
                (result!.Item?.media as any) || { L: [] },
              ).concat([data]),
            ),
            ":updated_at": convertToAttributeValue(timestamp),
          },
          UpdateExpression: "SET media = :media, updated_at = :updated_at",
          ReturnValues: "ALL_NEW",
        } as any;

        // update the catch in the database
        dynamoDb.updateItem(
          params,
          (error: any, result: UpdateItemOutput | undefined) => {
            // handle potential errors
            if (error) {
              console.error(error);
              callback(null, {
                statusCode: error.statusCode || 501,
                headers: { "Content-Type": "text/plain" },
                body: "Couldn't update the catch item.",
              });
              return;
            }

            // create a response
            const response = {
              statusCode: 200,
              body: JSON.stringify(convertFromItem(result!.Attributes as any)),
            };
            callback(null, response);
          },
        );
      } catch (error) {
        console.error(error);
        callback(null, {
          statusCode: 501,
          headers: { "Content-Type": "text/plain" },
          body: "Couldn't fetch the catch item.",
        });
      }
    },
  );
};
