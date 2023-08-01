import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyHandlerV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { convertToItem } from "../src/shared/dynamodb-utils";

export async function ensureTableNoData(tableName: string) {
  const dynamoDb = new DynamoDB({
    endpoint: process.env.DYNAMODB_ENDPOINT,
    region: process.env.AWS_REGION,
  });
  const table = await dynamoDb
    .describeTable({
      TableName: tableName,
    })
    .catch(() => undefined);
  if (table) {
    await dynamoDb.deleteTable({
      TableName: tableName,
    });
  }
  await dynamoDb.createTable({
    TableName: process.env.DYNAMODB_TABLE,
    AttributeDefinitions: [
      {
        AttributeName: "id",
        AttributeType: "S",
      },
    ],
    KeySchema: [
      {
        AttributeName: "id",
        KeyType: "HASH",
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
  });
}

export async function ensureTableWithData(tableName: string, data: any[]) {
  const dynamoDb = new DynamoDB({
    endpoint: process.env.DYNAMODB_ENDPOINT,
    region: process.env.AWS_REGION,
  });
  await ensureTableNoData(tableName);
  await dynamoDb.batchWriteItem({
    RequestItems: {
      [tableName]: data.map((item) => ({
        PutRequest: {
          Item: convertToItem(item) as any,
        },
      })),
    },
  });
}

export function request(
  func: APIGatewayProxyHandlerV2,
  request: { body?: any; pathParameters?: any },
) {
  return new Promise<APIGatewayProxyResultV2<any>>(async (resolve, reject) => {
    try {
      const result = await func(
        {
          headers: {
            "Content-Type": "application/json",
          },
          body: request.body ? JSON.stringify(request.body) : undefined,
          pathParameters: request.pathParameters,
        } as any,
        {} as any,
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result!);
          }
        },
      );
      if (typeof result !== "undefined") {
        resolve(result);
      }
    } catch (err) {
      reject(err);
    }
  });
}
