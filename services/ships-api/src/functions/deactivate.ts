import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { convertToAttr, unmarshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import {
  deleteCertificate,
  deleteThing,
  detachCertificateFromThing,
} from "../lib/iot-utils";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const dynamoDb = new DynamoDB({
    endpoint: process.env.DYNAMODB_ENDPOINT,
    region: process.env.AWS_REGION,
  });
  const timestamp = new Date().getTime();

  const { id } = event.pathParameters!;
  const result = await dynamoDb.getItem({
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: convertToAttr(id),
    },
  });

  if (!result.Item) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: "Ship not found",
      }),
    };
  }

  const item = unmarshall(result.Item);
  if (typeof item.iot_config === "undefined") {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Ship already unregistered",
      }),
    };
  }

  await detachCertificateFromThing(id!, item.iot_config.certificate_arn!);

  await deleteCertificate(item.iot_config.certificate_id!);

  await deleteThing(id!);

  await dynamoDb.updateItem({
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: convertToAttr(id),
    },
    ExpressionAttributeValues: {
      ":iot_enabled": convertToAttr(false),
      ":updated_at": convertToAttr(timestamp),
    },
    UpdateExpression:
      "SET iot_enabled = :iot_enabled, updated_at = :updated_at REMOVE iot_config",
    ReturnValues: "ALL_NEW",
  });

  return {
    statusCode: 204,
  };
};
