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
      .on(QueryCommand, {
        QueryString: `SELECT to_iso8601(time) || 'Z', measure_value::varchar, horizontal_dilution FROM ${process.env.TIMESTREAM_DATABASE}.${process.env.TIMESTREAM_TABLE_SHIPS_POSITION} WHERE measure_name = 'position' AND id = 'test' AND measure_value::varchar <> '{"longitude":null,"latitude":null}' ORDER BY time DESC LIMIT 500`,
      })
      .resolves({
        QueryId: "test",
        Rows: [
          {
            Data: [
              {
                ScalarValue: "2023-08-11T17:13:21Z",
              },
              {
                ScalarValue: JSON.stringify({
                  latitude: 135,
                  longitude: 45,
                }),
              }
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
          time: "2023-08-11T17:13:21Z",
          position: { latitude: 135, longitude: 45 },
        },
      ],
    });
  });

  it("should get a ship logs after specific time", async () => {
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
      .on(QueryCommand, {
        QueryString: `SELECT to_iso8601(time) || 'Z', measure_value::varchar, horizontal_dilution FROM ${process.env.TIMESTREAM_DATABASE}.${process.env.TIMESTREAM_TABLE_SHIPS_POSITION} WHERE measure_name = 'position' AND id = 'test' AND measure_value::varchar <> '{"longitude":null,"latitude":null}' AND time > from_iso8601_timestamp('2023-08-11T17:13:20Z') ORDER BY time DESC LIMIT 500`,
      })
      .resolves({
        QueryId: "test",
        Rows: [
          {
            Data: [
              {
                ScalarValue: "2023-08-11T17:13:21Z",
              },
              {
                ScalarValue: JSON.stringify({
                  latitude: 135,
                  longitude: 45,
                }),
              }
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
        queryStringParameters: {
          after: "2023-08-11T17:13:20Z",
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
          time: "2023-08-11T17:13:21Z",
          position: { latitude: 135, longitude: 45 },
        },
      ],
    });
  });

  it("should get a ship logs before specific time", async () => {
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
      .on(QueryCommand, {
        QueryString: `SELECT to_iso8601(time) || 'Z', measure_value::varchar, horizontal_dilution FROM ${process.env.TIMESTREAM_DATABASE}.${process.env.TIMESTREAM_TABLE_SHIPS_POSITION} WHERE measure_name = 'position' AND id = 'test' AND measure_value::varchar <> '{"longitude":null,"latitude":null}' AND time < from_iso8601_timestamp('2023-08-11T17:13:20Z') ORDER BY time DESC LIMIT 500`,
      })
      .resolves({
        QueryId: "test",
        Rows: [
          {
            Data: [
              {
                ScalarValue: "2023-08-11T17:13:21Z",
              },
              {
                ScalarValue: JSON.stringify({
                  latitude: 135,
                  longitude: 45,
                }),
              }
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
        queryStringParameters: {
          before: "2023-08-11T17:13:20Z",
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
          time: "2023-08-11T17:13:21Z",
          position: { latitude: 135, longitude: 45 },
        },
      ],
    });
  });
});
