import AWSMock from "aws-sdk-mock";
import AWS from "aws-sdk";
import { ScanInput, ScanOutput } from "aws-sdk/clients/dynamodb";
import { list } from "../src/functions/list";

describe("list function", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV };
  });

  it("should call scan of dynamodb documentclient api", () => {
    process.env.DYNAMODB_TABLE = "catches-api-test";
    const data = { data: "text" };

    AWSMock.setSDKInstance(AWS);
    AWSMock.mock(
      "DynamoDB.DocumentClient",
      "scan",
      (params: ScanInput, callback: Function) => {
        console.log("DynamoDB.DocumentClient", "list", "mock called");
        expect(params).toMatchObject({
          TableName: process.env.DYNAMODB_TABLE,
        });
        callback(null, { Items: [data] } as ScanOutput);
      }
    );
    const mockCallback = jest.fn();

    list({ pathParameters: { id: "id" } } as any, {} as any, mockCallback);

    expect(mockCallback.mock.calls.length).toBe(1);
    expect(mockCallback.mock.calls[0][0]).toBeNull();
    expect(mockCallback.mock.calls[0][1]).toMatchObject({
      statusCode: 200,
      body: JSON.stringify([data]),
    });
    AWSMock.restore("DynamoDB.DocumentClient");
  });
});
