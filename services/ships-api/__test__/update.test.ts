import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { apiEvent, callLambda, ensureTableWithData } from "./utils";
import { handler as updateHandler } from "../src/functions/update";

describe("update ship", () => {
  const OLD_ENV = process.env;

  beforeEach(async () => {
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
    process.env.DYNAMODB_TABLE = "ships-update";
  });

  afterAll(() => {
    process.env = OLD_ENV; // Make a copy
  });

  it("should update a ship", async () => {
    const dynamoDb = new DynamoDB({
      endpoint: process.env.DYNAMODB_ENDPOINT,
      region: process.env.AWS_REGION,
    });
    await ensureTableWithData(dynamoDb, process.env.DYNAMODB_TABLE!, [
      {
        id: "test",
        name: "test name",
        created_at: 1630793102,
        updated_at: 1630793102,
      },
    ]);
    const result = await callLambda(
      updateHandler,
      apiEvent({
        pathParameters: {
          id: "test",
        },
        body: {
          name: "test name🚩",
        },
      }),
    );

    if (typeof result !== "object") {
      fail("result is not an object");
    }
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body!)).toEqual({
      id: expect.any(String),
      name: "test name🚩",
      created_at: 1630793102,
      updated_at: expect.not.stringMatching("1630793102"),
    });
  });
});
