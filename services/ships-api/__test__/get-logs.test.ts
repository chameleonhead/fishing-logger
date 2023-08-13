import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { apiEvent, callLambda, ensureTableWithData } from "./utils";
import { handler as getLogsHandler } from "../src/functions/get-logs";
import { mockClient } from "aws-sdk-client-mock";
import {
  QueryCommand,
  TimestreamQuery,
} from "@aws-sdk/client-timestream-query";

describe("get a ship logs", () => {
  const OLD_ENV = process.env;

  beforeEach(async () => {
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
    process.env.DYNAMODB_TABLE = "ships-get-logs";
  });

  afterAll(() => {
    process.env = OLD_ENV; // Make a copy
  });

  it("should get a ship logs", async () => {
    const dynamoDb = new DynamoDB({
      endpoint: process.env.DYNAMODB_ENDPOINT,
      region: process.env.AWS_REGION,
    });
    await ensureTableWithData(dynamoDb, process.env.DYNAMODB_TABLE!, [
      {
        id: "test",
        name: "test",
        iot_enabled: false,
      },
    ]);
    mockClient(TimestreamQuery)
      .on(QueryCommand)
      .resolves({
        QueryId: "test",
        Rows: [
          {
            Data: [
              {
                TimeSeriesValue: [
                  {
                    Time: "2023-03-04T00:00:00.000000000Z",
                    Value: {
                      ScalarValue: JSON.stringify({
                        latitude: 135,
                        longitude: 45,
                      }),
                    },
                  },
                ],
              },
            ],
          },
        ],
      });
    const result = await callLambda(
      getLogsHandler,
      apiEvent({
        pathParameters: {
          id: "test",
        },
      }),
    );

    if (typeof result !== "object") {
      fail("result is not an object");
    }
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body!)).toEqual({
      logs: [
        {
          time: "2023-03-04T00:00:00.000000000Z",
          position: { latitude: 135, longitude: 45 },
        },
      ],
    });
  });
});
