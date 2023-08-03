import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { initiateUpload } from "../src/functions/initiate-upload";
import {
  ensureTableNoData,
  callLambda,
  apiEvent,
  s3Event,
  ensureBucketNoData,
} from "./utils";
import fetch from "node-fetch";
import { onUploadCompleted } from "../src/functions/on-upload-completed";
import { get } from "../src/functions/get";
import { S3 } from "@aws-sdk/client-s3";
import FormData from "form-data";

describe("upload media", () => {
  const OLD_ENV = process.env;

  beforeEach(async () => {
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
    process.env.DYNAMODB_TABLE = "media-upload";
    process.env.S3_BUCKET = "media-upload";
  });

  afterAll(() => {
    process.env = OLD_ENV; // Make a copy
  });

  it("should upload a media", async () => {
    const dynamoDb = new DynamoDB({
      endpoint: process.env.DYNAMODB_ENDPOINT,
      region: process.env.AWS_REGION,
    });
    const s3 = new S3({
      endpoint: process.env.S3_ENDPOINT,
      region: process.env.AWS_REGION,
      forcePathStyle: !!process.env.S3_ENDPOINT,
    });
    await ensureTableNoData(dynamoDb, process.env.DYNAMODB_TABLE!);
    await ensureBucketNoData(s3, process.env.S3_BUCKET!);
    const result = await callLambda(
      initiateUpload,
      apiEvent({
        body: {
          name: "test.jpg",
          content_type: "image/jpeg",
          last_modified: 1630770302000,
          size: 1000,
        },
      }),
    );
    if (typeof result !== "object") {
      fail("result is not object");
    }
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body!)).toEqual({
      id: expect.any(String),
      data: {
        id: expect.any(String),
        name: "test.jpg",
        content_type: "image/jpeg",
        last_modified: 1630770302000,
        size: 1000,
      },
      url: expect.any(String),
      fields: expect.any(Object),
      created_at: expect.any(Number),
      updated_at: expect.any(Number),
    });

    const resultObject = JSON.parse(result.body!);
    const formData = new FormData();
    Object.entries(resultObject.fields).forEach(([k, v]) => {
      formData.append(k, v as string);
    });
    formData.append("file", Buffer.from("test"));
    await fetch(resultObject.url, {
      method: "POST",
      body: formData,
    }).then((res) => {
      if (!res.ok) {
        throw new Error(`Failed to upload file ${res.statusText}`);
      }
      return res.text();
    });

    await callLambda(
      onUploadCompleted,
      s3Event({ bucket: process.env.S3_BUCKET!, key: resultObject.id }),
    );

    const getResult = await callLambda(
      get,
      apiEvent({ pathParameters: { id: resultObject.data.id } }),
    );
    if (typeof getResult !== "object") {
      fail("result is not object");
    }
    expect(getResult.statusCode).toBe(200);
  });
});
