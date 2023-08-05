import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { apiEvent, callLambda, ensureTableWithData } from "./utils";
import { handler as listHandler } from "../src/functions/list";

describe("list ships", () => {
  const OLD_ENV = process.env;

  beforeEach(async () => {
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
    process.env.DYNAMODB_TABLE = "ships-list";
  });

  afterAll(() => {
    process.env = OLD_ENV; // Make a copy
  });

  it("should list ships", async () => {
    const dynamoDb = new DynamoDB({
      endpoint: process.env.DYNAMODB_ENDPOINT,
      region: process.env.AWS_REGION,
    });
    await ensureTableWithData(dynamoDb, process.env.DYNAMODB_TABLE!, [
      {
        id: "test1",
        name: "USS Enterprise 1",
      },
      {
        id: "test2",
        name: "USS Enterprise 2",
      },
    ]);
    const result = await callLambda(listHandler, apiEvent({}));

    if (typeof result !== "object") {
      fail("result is not an object")
    }
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body!)).toEqual({
      ships: [
        {
          id: "test1",
          name: "USS Enterprise 1",
        },
        {
          id: "test2",
          name: "USS Enterprise 2",
        },
      ],
    });
  });
});
