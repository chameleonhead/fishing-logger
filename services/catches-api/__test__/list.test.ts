import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { list } from "../src/functions/list";
import { apiEvent, callLambda, ensureTableWithData } from "./utils";

describe("list catches", () => {
  const OLD_ENV = process.env;

  beforeEach(async () => {
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
    process.env.DYNAMODB_TABLE = "catches-list";
  });

  afterAll(() => {
    process.env = OLD_ENV; // Make a copy
  });

  it("should list catches", async () => {
    const dynamoDb = new DynamoDB({
      endpoint: process.env.DYNAMODB_ENDPOINT,
      region: process.env.AWS_REGION,
    });
    await ensureTableWithData(dynamoDb, process.env.DYNAMODB_TABLE!, [
      {
        id: "test1",
        catched_at: "2022-09-04T18:05:02Z",
      },
      {
        id: "test2",
        catched_at: "2022-09-04T18:05:03Z",
      },
    ]);
    const result = await callLambda(list, apiEvent({}));

    if (typeof result !== "object") {
      fail("result is not an object")
    }
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body!)).toEqual({
      items: [
        {
          id: "test1",
          catched_at: "2022-09-04T18:05:02Z",
        },
        {
          id: "test2",
          catched_at: "2022-09-04T18:05:03Z",
        },
      ],
    });
  });
});
