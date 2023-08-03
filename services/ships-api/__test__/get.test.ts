import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { get } from "../src/functions/get";
import { apiEvent, callLambda, ensureTableWithData } from "./utils";

describe("get a ship", () => {
  const OLD_ENV = process.env;

  beforeEach(async () => {
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
    process.env.DYNAMODB_TABLE = "ships-get";
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
        iot_enabled: true,
        iot_config: {
          certificate_id: "cert_id",
          certificate_arn: "cert_arn",
          cerfiticate_pem: "cert_pem",
        },
      },
    ]);
    const result = await callLambda(get, apiEvent({
      pathParameters: {
        id: "test",
      },
    }));

    if (typeof result !== "object") {
      fail("result is not an object")
    }
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body!)).toEqual({
      id: "test",
      name: "test",
      iot_enabled: true,
    });
  });
});
