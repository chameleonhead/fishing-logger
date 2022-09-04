import AWSMock from "aws-sdk-mock";
import AWS from "aws-sdk";
import { GetItemInput, GetItemOutput } from "aws-sdk/clients/dynamodb";
import { get } from "../src/functions/get";

describe("get function", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV };
  });

  it("should call get of dynamodb documentclient api", () => {
    process.env.DYNAMODB_TABLE = "catches-api-test";
    const data = { data: "text" };

    AWSMock.setSDKInstance(AWS);
    AWSMock.mock(
      "DynamoDB.DocumentClient",
      "get",
      (params: GetItemInput, callback: Function) => {
        console.log("DynamoDB.DocumentClient", "get", "mock called");
        expect(params).toMatchObject({
          TableName: process.env.DYNAMODB_TABLE,
          Key: {
            id: "id",
          },
        });
        callback(null, { Item: data } as GetItemOutput);
      }
    );
    const mockCallback = jest.fn();

    get({ pathParameters: { id: "id" } } as any, {} as any, mockCallback);

    expect(mockCallback.mock.calls.length).toBe(1);
    expect(mockCallback.mock.calls[0][0]).toBeNull();
    expect(mockCallback.mock.calls[0][1]).toMatchObject({
      statusCode: 200,
      body: JSON.stringify(data),
    });
    AWSMock.restore("DynamoDB.DocumentClient");
  });
});
