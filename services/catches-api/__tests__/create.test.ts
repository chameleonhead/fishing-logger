import AWSMock from "aws-sdk-mock";
import AWS from "aws-sdk";
import { PutItemInput, PutItemOutput } from "aws-sdk/clients/dynamodb";
import { create } from "../src/functions/create";

describe("create function", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV };
  });

  it("should call put of dynamodb documentclient api", () => {
    process.env.DYNAMODB_TABLE = "catches-api-test";
    const data = {
      catched_at: "2022-09-04T18:05:02Z",
      place: {
        latitude: 35.65809922,
        longitude: 139.74135747,
      },
      fishes: [
        {
          species: "オオモンハタ",
          sizeText: "20cm",
          count: 1,
        },
      ],
      method: {
        type: "釣",
        details: "餌釣り（ゴカイ）",
      },
    };

    AWSMock.setSDKInstance(AWS);
    AWSMock.mock(
      "DynamoDB.DocumentClient",
      "put",
      (params: PutItemInput, callback: Function) => {
        console.log("DynamoDB.DocumentClient", "put", "mock called");
        expect(params).toMatchObject({
          TableName: process.env.DYNAMODB_TABLE,
          Item: data,
        });
        callback(null, {} as PutItemOutput);
      }
    );
    const mockCallback = jest.fn();

    create({ body: JSON.stringify(data) } as any, {} as any, mockCallback);

    expect(mockCallback.mock.calls.length).toBe(1);
    expect(mockCallback.mock.calls[0][0]).toBeNull();
    expect(mockCallback.mock.calls[0][1]).toMatchObject({ statusCode: 200 });
    AWSMock.restore("DynamoDB.DocumentClient");
  });
});
