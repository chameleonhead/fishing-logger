import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { apiEvent, callLambda, ensureTableWithData } from "./utils";
import { handler as deleteHandler } from "../src/functions/delete";

describe("delete a ship", () => {
  const OLD_ENV = process.env;

  beforeEach(async () => {
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
    process.env.DYNAMODB_TABLE = "ships-delete";
  });

  afterAll(() => {
    process.env = OLD_ENV; // Make a copy
  });

  it("should get a ship", async () => {
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
    const result = await callLambda(deleteHandler, apiEvent({
      pathParameters: {
        id: "test",
      },
    }));

    if (typeof result !== "object") {
      fail("result is not an object")
    }
    expect(result.statusCode).toBe(204);

    const ship = await dynamoDb.getItem({
      TableName: process.env.DYNAMODB_TABLE!,
      Key: {
        id: { S: "test" },
      }
    })
    expect(ship.Item).toBeUndefined();
  });
});
