import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { update } from "../src/functions/update";
import { ensureTableWithData, request } from "./utils";

describe("update catch", () => {
  const OLD_ENV = process.env;

  beforeEach(async () => {
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
    process.env.DYNAMODB_TABLE = "catches-update";
  });

  afterAll(() => {
    process.env = OLD_ENV; // Make a copy
  });

  it("should update a catch", async () => {
    const dynamoDb = new DynamoDB({
      endpoint: process.env.DYNAMODB_ENDPOINT,
      region: process.env.AWS_REGION,
    });
    await ensureTableWithData(dynamoDb, process.env.DYNAMODB_TABLE!, [
      {
        id: "test",
        catched_at: "2022-09-04T18:05:02Z",
        place: {
          latitude: 35.65809922,
          longitude: 139.74135747,
        },
        fishes: [
          {
            species: "オオモンハタ",
            size_text: "20cm",
            count: 1,
          },
        ],
        method: {
          type: "釣",
          details: "餌釣り（ゴカイ）",
        },
        created_at: 1630793102,
        updated_at: 1630793102,
      },
    ]);
    const result = await request(update, {
      pathParameters: {
        id: "test",
      },
      body: {
        catched_at: "2022-09-04T18:05:02Z",
        place: {
          latitude: 35.65809922,
          longitude: 139.74135747,
        },
        fishes: [
          {
            species: "オオモンハタ🚩",
            size_text: "20cm",
            count: 1,
          },
        ],
        method: {
          type: "釣",
          details: "餌釣り（ゴカイ）",
        },
      },
    });
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({
      id: expect.any(String),
      catched_at: "2022-09-04T18:05:02Z",
      place: {
        latitude: 35.65809922,
        longitude: 139.74135747,
      },
      fishes: [
        {
          species: "オオモンハタ🚩",
          size_text: "20cm",
          count: 1,
        },
      ],
      method: {
        type: "釣",
        details: "餌釣り（ゴカイ）",
      },
      created_at: 1630793102,
      updated_at: expect.not.stringMatching("1630793102"),
    });
  });
});
