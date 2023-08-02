import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { get } from "../src/functions/get";
import { ensureTableWithData, request } from "./utils";

describe("get media", () => {
  const OLD_ENV = process.env;

  beforeEach(async () => {
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
    process.env.DYNAMODB_TABLE = "media-get";
  });

  afterAll(() => {
    process.env = OLD_ENV; // Make a copy
  });

  it("should get a media", async () => {
    const dynamoDb = new DynamoDB({
      endpoint: process.env.DYNAMODB_ENDPOINT,
      region: process.env.AWS_REGION,
    });
    await ensureTableWithData(dynamoDb, process.env.DYNAMODB_TABLE!, [
      {
        id: "test",
        data: {
          id: "data-id",
          name: "test.jpg",
          content_type: "image/jpeg",
          last_modified: 1630770302000,
          size: 1000,
        },
        url: "https://example.com/test.jpg",
        fields: {
          "Content-Type": "image/jpeg",
        },
        created_at: 1630770302000,
        updated_at: 1630770302000,
      },
    ]);
    const result = await request(get, {
      pathParameters: {
        id: "test",
      },
    });
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({
      id: expect.any(String),
      mediaed_at: "2022-09-04T18:05:02Z",
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
    });
  });
});
