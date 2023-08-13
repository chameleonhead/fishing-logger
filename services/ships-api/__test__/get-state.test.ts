import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { apiEvent, callLambda, ensureTableWithData } from "./utils";
import { handler as getStateHandler } from "../src/functions/get-state";

describe("get a ship state", () => {
  const OLD_ENV = process.env;

  beforeEach(async () => {
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
    process.env.DYNAMODB_TABLE = "ships-get-state";
  });

  afterAll(() => {
    process.env = OLD_ENV; // Make a copy
  });

  it("should get a ship state", async () => {
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
      {
        id: "signalk:test",
        last_updated: "test",
      },
    ]);
    const result = await callLambda(
      getStateHandler,
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
      signalk: {
        last_updated: "test",
      },
    });
  });
});
