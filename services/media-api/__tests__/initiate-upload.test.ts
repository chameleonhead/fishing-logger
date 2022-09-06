import AWSMock from "aws-sdk-mock";
import AWS from "aws-sdk";
import { PutItemInput, PutItemOutput } from "aws-sdk/clients/dynamodb";
import { initiateUpload } from "../src/functions/initiate-upload";

describe("initiate-upload function", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV };
  });

  it("should call put of dynamodb documentclient api", () => {
    process.env.DYNAMODB_TABLE = "media-api-test";
    const data = {
      target: {
        resourceUrl: "/api/media/"
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

    initiateUpload({ body: JSON.stringify(data) } as any, {} as any, mockCallback);

    expect(mockCallback.mock.calls.length).toBe(1);
    expect(mockCallback.mock.calls[0][0]).toBeNull();
    expect(mockCallback.mock.calls[0][1]).toMatchObject({ statusCode: 200 });
    AWSMock.restore("DynamoDB.DocumentClient");
  });
});
