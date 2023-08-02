import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { convertToAttr, unmarshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import {
  attachCertificateToThing,
  createCertificateFromCsr,
  createKeysAndCertificate,
  ensureThingExists,
  getIotConfigurations,
} from "../lib/iot-utils";

export const registerIot: APIGatewayProxyHandlerV2 = async (event) => {
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
  if (item.iotConfig) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Ship already registered",
      }),
    };
  }

  await ensureThingExists(id!);

  if (event.body) {
    const { csr } = JSON.parse(event.body!);
    const { certificateArn, certificateId, certificatePem } =
      await createCertificateFromCsr(csr);
    await attachCertificateToThing(certificateArn!, id!);
    await dynamoDb.updateItem({
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        id: convertToAttr(id),
      },
      ExpressionAttributeValues: {
        ":iot_enabled": convertToAttr(true),
        ":iot_config": convertToAttr({
          csr,
          certificate_arn: certificateArn,
          certificate_id: certificateId,
          certificate_pem: certificatePem,
        }),
        ":updated_at": convertToAttr(timestamp),
      },
      UpdateExpression:
        "SET iot_enabled = :iot_enabled, iot_config = :iot_config, updated_at = :updated_at",
      ReturnValues: "ALL_NEW",
    });

    const { iotEndpoint, caCertificate } = await getIotConfigurations();

    return {
      statusCode: 200,
      body: JSON.stringify({
        iot_endpoint: iotEndpoint,
        certificate: certificatePem,
        ca_certificate: caCertificate,
      }),
    };
  } else {
    const { certificateArn, certificateId, certificatePem, keyPair } =
      await createKeysAndCertificate();
    await attachCertificateToThing(certificateArn!, id!);
    await dynamoDb.updateItem({
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        id: convertToAttr(id),
      },
      ExpressionAttributeValues: {
        ":iot_enabled": convertToAttr(true),
        ":iot_config": convertToAttr({
          certificate_arn: certificateArn,
          certificate_id: certificateId,
          certificate_pem: certificatePem,
          key_pair: keyPair,
        }),
        ":updated_at": convertToAttr(timestamp),
      },
      UpdateExpression:
        "SET iot_enabled = :iot_enabled, iot_config = :iot_config, updated_at = :updated_at",
      ReturnValues: "ALL_NEW",
    });

    const { iotEndpoint, caCertificate } = await getIotConfigurations();

    return {
      statusCode: 200,
      body: JSON.stringify({
        iot_endpoint: iotEndpoint,
        certificate: certificatePem,
        ca_certificate: caCertificate,
        key_pair: {
          public_key: keyPair.PublicKey,
          private_key: keyPair.PrivateKey,
        },
      }),
    };
  }
};
