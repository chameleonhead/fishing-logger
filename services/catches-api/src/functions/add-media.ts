import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { convertToAttr, convertToNative, unmarshall } from "@aws-sdk/util-dynamodb";

export const addMedia: APIGatewayProxyHandlerV2 = async (
  event,
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
      id: convertToAttr(event.pathParameters!.id),
    },
  };

  try {
    // fetch catch from the database
    const result = await dynamoDb.getItem(params);

    try {
      const params = {
        TableName: process.env.DYNAMODB_TABLE!,
        Key: {
          id: convertToAttr(event.pathParameters!.id),
        },
        ExpressionAttributeValues: {
          ":media": convertToAttr(
            convertToNative(
              (result!.Item?.media as any) || { L: [] },
            ).concat([data]),
          ),
          ":updated_at": convertToAttr(timestamp),
        },
        UpdateExpression: "SET media = :media, updated_at = :updated_at",
        ReturnValues: "ALL_NEW",
      };

      // update the catch in the database
      const updateResult = await dynamoDb.updateItem(params)

      // create a response
      return {
        statusCode: 200,
        body: JSON.stringify(unmarshall(updateResult!.Attributes as any)),
      };
    } catch (error: any) {
      console.error(error);
      return {
        statusCode: error.statusCode || 501,
        headers: { "Content-Type": "text/plain" },
        body: "Couldn't update the catch item.",
      };
    }

  } catch (error: any) {
    console.error(error);
    return {
      statusCode: error.statusCode || 501,
      headers: { "Content-Type": "text/plain" },
      body: "Couldn't fetch the catch item.",
    };
  }
};
