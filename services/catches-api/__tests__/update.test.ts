import AWSMock from "aws-sdk-mock";
import AWS from "aws-sdk";
import { UpdateItemInput, UpdateItemOutput } from "aws-sdk/clients/dynamodb";
import { update } from "../src/functions/update";

describe("update function", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV };
  });

  it("should call update of dynamodb documentclient api", () => {
    process.env.DYNAMODB_TABLE = "catches-api-test";
    const data = {
      catched_at: "2022-09-04T18:05:02Z",
    };

    AWSMock.setSDKInstance(AWS);
    AWSMock.mock(
      "DynamoDB.DocumentClient",
      "update",
      (params: UpdateItemInput, callback: Function) => {
        console.log("DynamoDB.DocumentClient", "update", "mock called");
        expect(params).toMatchObject({
          TableName: process.env.DYNAMODB_TABLE,
          Key: {
            id: "id",
          },
          ExpressionAttributeNames: {
            "#attr0": "catched_at",
          },
          ExpressionAttributeValues: {
            ":catched_at": data.catched_at,
          },
          UpdateExpression: "SET #attr0 = :catched_at, updatedAt = :updatedAt",
        });
        callback(null, {} as UpdateItemOutput);
      }
    );
    const mockCallback = jest.fn();

    update(
      {
        pathParameters: {
          id: "id",
        },
        body: JSON.stringify(data),
      } as any,
      {} as any,
      mockCallback
    );

    expect(mockCallback.mock.calls.length).toBe(1);
    expect(mockCallback.mock.calls[0][0]).toBeNull();
    expect(mockCallback.mock.calls[0][1]).toMatchObject({ statusCode: 200 });
    AWSMock.restore("DynamoDB.DocumentClient");
  });

  it("should call update of dynamodb documentclient api, given input data has more than 2 columns", () => {
    process.env.DYNAMODB_TABLE = "catches-api-test";
    const data = {
      catched_at: "2022-09-04T18:05:02Z",
      method: {
        type: "その他",
      },
    };

    AWSMock.setSDKInstance(AWS);
    AWSMock.mock(
      "DynamoDB.DocumentClient",
      "update",
      (params: UpdateItemInput, callback: Function) => {
        console.log("DynamoDB.DocumentClient", "update", "mock called");
        expect(params).toMatchObject({
          TableName: process.env.DYNAMODB_TABLE,
          Key: {
            id: "id",
          },
          ExpressionAttributeNames: {
            "#attr0": "catched_at",
            "#attr1": "method",
          },
          ExpressionAttributeValues: {
            ":catched_at": data.catched_at,
            ":method": data.method,
          },
          UpdateExpression:
            "SET #attr0 = :catched_at, #attr1 = :method, updatedAt = :updatedAt",
        });
        callback(null, {} as UpdateItemOutput);
      }
    );
    const mockCallback = jest.fn();

    update(
      {
        pathParameters: {
          id: "id",
        },
        body: JSON.stringify(data),
      } as any,
      {} as any,
      mockCallback
    );

    expect(mockCallback.mock.calls.length).toBe(1);
    expect(mockCallback.mock.calls[0][0]).toBeNull();
    expect(mockCallback.mock.calls[0][1]).toMatchObject({ statusCode: 200 });
    AWSMock.restore("DynamoDB.DocumentClient");
  });
});
