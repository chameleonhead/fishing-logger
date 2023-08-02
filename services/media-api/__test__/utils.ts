import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { S3 } from "@aws-sdk/client-s3";
import { marshall } from "@aws-sdk/util-dynamodb";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyEventV2,
  Handler,
  S3Event,
  S3NotificationEvent,
} from "aws-lambda";

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

export async function ensureBucketNoData(s3: S3, bucket: string) {
  const bucketLocation = await s3
    .getBucketLocation({ Bucket: bucket })
    .catch(() => undefined);
  if (bucketLocation) {
    console.log(`Deleting bucket ${bucket}`);
    await s3.listObjects({ Bucket: bucket }).then(async (result) => {
      return Promise.all(
        result.Contents?.map(async (object) => {
          await s3.deleteObject({ Bucket: bucket, Key: object.Key! });
          console.log(`Deleted object ${object.Key}`);
        }) || [],
      );
    });
    await s3.deleteBucket({ Bucket: bucket });
    console.log(`Deleted bucket ${bucket}`);
  }
  console.log(`Creating bucket ${bucket}`);
  await s3.createBucket({ Bucket: bucket });
  console.log(`Created bucket ${bucket}`);
}

export function callLambda<TRequest, TResponse>(
  handler: Handler<TRequest, TResponse>,
  request: TRequest,
) {
  return new Promise<TResponse>(async (resolve, reject) => {
    try {
      const result = await handler(request, {} as any, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result!);
        }
      });
      if (typeof result !== "undefined") {
        resolve(result);
      }
    } catch (err) {
      reject(err);
    }
  });
}

export function apiEvent({
  method = "GET",
  path = "/",
  body = {},
  pathParameters = {},
}: any) {
  return {
    version: "",
    routeKey: "",
    rawPath: path,
    rawQueryString: "",
    cookies: undefined,
    headers: {
      "Content-Type": "application/json",
    },
    queryStringParameters: undefined,
    requestContext: {
      accountId: "",
      apiId: "",
      domainName: "domain-name",
      domainPrefix: "domain-prefix",
      http: {
        method,
        path,
        protocol: "HTTP/1.1",
        sourceIp: "",
        userAgent: "",
      },
      requestId: "request-id",
      routeKey: "route-key",
      stage: "stage",
      time: "2023-08-02T04:03:42Z",
      timeEpoch: 1690949022,
    },
    body: body ? JSON.stringify(body) : undefined,
    pathParameters: pathParameters,
    isBase64Encoded: false,
    stageVariables: undefined,
  } as APIGatewayProxyEventV2;
}

export function s3Event({ bucket, key }: { bucket: string; key: string }) {
  return {
    Records: [
      {
        s3: {
          bucket: {
            name: bucket,
          },
          object: {
            key: key,
          },
        },
      },
    ],
  } as S3Event;
}
