import { get } from "../src/functions/get";
import { ensureTableWithData, request } from "./utils";

describe("get catch", () => {
  const OLD_ENV = process.env;

  beforeEach(async () => {
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
    process.env.DYNAMODB_TABLE = "catches-get";
  });

  afterAll(() => {
    process.env = OLD_ENV; // Make a copy
  });

  it("should get a catch", async () => {
    await ensureTableWithData(process.env.DYNAMODB_TABLE!, [
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
    });
  });
});
