import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyHandlerV2, APIGatewayProxyResultV2 } from "aws-lambda";

export async function ensureTableNoData(dynamoDb: DynamoDB, tableName: string) {
  const table = await dynamoDb
    .describeTable({
      TableName: tableName,
    })
    .catch(() => undefined);
  if (table?.Table) {
    console.log(`Deleting table ${tableName}`);
    await dynamoDb.deleteTable({
      TableName: tableName,
    });
    console.log(`Deleted table ${tableName}`);
  }
  console.log(`Creating table ${tableName}`);
  await dynamoDb.createTable({
    TableName: tableName,
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
  console.log(`Created table ${tableName}`);
}

export async function ensureTableWithData(
  dynamoDb: DynamoDB,
  tableName: string,
  data: any[],
) {
  await ensureTableNoData(dynamoDb, tableName);
  console.log(`Writing data to table ${tableName}`);
  await dynamoDb.batchWriteItem({
    RequestItems: {
      [tableName]: data.map((item) => ({
        PutRequest: {
          Item: marshall(item) as any,
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
