import { list } from "../src/functions/list";
import { ensureTableWithData, request } from "./utils";

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
    await ensureTableWithData(process.env.DYNAMODB_TABLE!, [
      {
        id: "test1",
        catched_at: "2022-09-04T18:05:02Z",
      },
      {
        id: "test2",
        catched_at: "2022-09-04T18:05:03Z",
      },
    ]);
    const result = await request(list, {});
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({
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
