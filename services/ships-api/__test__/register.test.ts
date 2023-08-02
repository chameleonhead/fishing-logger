import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { create } from "../src/functions/create";
import { registerIot } from "../src/functions/register-iot";
import { generateCSR } from "./csr-utils";
import { apiEvent, callLambda, ensureTableNoData } from "./utils";
import {
  AddThingToThingGroupCommand,
  AttachPolicyCommand,
  AttachThingPrincipalCommand,
  CreateCertificateFromCsrCommand,
  CreateKeysAndCertificateCommand,
  CreateThingCommand,
  DescribeEndpointCommand,
  DescribeThingCommand,
  IoT,
} from "@aws-sdk/client-iot";
import { mockClient } from "aws-sdk-client-mock";

describe("register a ship", () => {
  const OLD_ENV = process.env;
  const iotMock = mockClient(IoT);

  beforeEach(async () => {
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
    process.env.DYNAMODB_TABLE = "ships-register";
  });

  afterAll(() => {
    process.env = OLD_ENV; // Make a copy
  });

  it("should register a ship with iot", async () => {
    const dynamoDb = new DynamoDB({
      endpoint: process.env.DYNAMODB_ENDPOINT,
      region: process.env.AWS_REGION,
    });
    await ensureTableNoData(dynamoDb, process.env.DYNAMODB_TABLE!);

    const result = await callLambda(
      create,
      apiEvent({
        body: {
          name: "ship name",
        },
      }),
    );

    if (typeof result !== "object") {
      fail("result is not an object");
    }

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body!)).toEqual({
      id: expect.any(String),
    });

    const { id: shipId } = JSON.parse(result.body!);

    iotMock.on(CreateCertificateFromCsrCommand).rejects({
      name: "ResourceAlreadyExistsException",
    });
    iotMock.on(CreateKeysAndCertificateCommand).resolves({
      keyPair: {
        PublicKey: "PublicKey",
        PrivateKey: "PrivateKey",
      },
      certificateArn: "certificateArn",
      certificateId: "certificateId",
      certificatePem: "certificatePem",
    });
    iotMock.on(DescribeThingCommand).resolves({
      thingArn: "thingArn",
    });
    iotMock.on(CreateThingCommand).rejects({
      name: "ResourceNotFoundException",
    });
    iotMock.on(AddThingToThingGroupCommand).resolves({});
    iotMock.on(AttachThingPrincipalCommand).resolves({});
    iotMock.on(AttachPolicyCommand).resolves({});
    iotMock.on(DescribeEndpointCommand).resolves({
      endpointAddress: "endpointAddress",
    });
    const iotResult = await callLambda(
      registerIot,
      apiEvent({
        pathParameters: {
          id: shipId,
        },
      }),
    );

    if (typeof iotResult !== "object") {
      fail("iotResult is not an object");
    }

    expect(iotResult.statusCode).toBe(200);
    expect(JSON.parse(iotResult.body!)).toEqual({
      iot_endpoint: "endpointAddress",
      certificate: "certificatePem",
      ca_certificate: expect.any(String),
      key_pair: {
        public_key: "PublicKey",
        private_key: "PrivateKey",
      },
    });
  });

  it("should register a ship with iot associated by csr", async () => {
    const dynamoDb = new DynamoDB({
      endpoint: process.env.DYNAMODB_ENDPOINT,
      region: process.env.AWS_REGION,
    });
    await ensureTableNoData(dynamoDb, process.env.DYNAMODB_TABLE!);

    const { csrData, privateKey } = generateCSR("test");
    const result = await callLambda(
      create,
      apiEvent({
        body: {
          name: "ship name",
        },
      }),
    );

    if (typeof result !== "object") {
      fail("result is not an object");
    }

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body!)).toEqual({
      id: expect.any(String),
    });

    const { id: shipId } = JSON.parse(result.body!);

    iotMock.on(CreateKeysAndCertificateCommand).rejects({
      name: "ResourceAlreadyExistsException",
    });
    iotMock.on(CreateCertificateFromCsrCommand).resolves({
      certificateArn: "certificateArn",
      certificateId: "certificateId",
      certificatePem: "certificatePem",
    });
    iotMock.on(DescribeThingCommand).rejects({
      name: "ResourceNotFoundException",
    });
    iotMock.on(CreateThingCommand).resolves({
      thingArn: "thingArn",
    });
    iotMock.on(AddThingToThingGroupCommand).resolves({});
    iotMock.on(AttachThingPrincipalCommand).resolves({});
    iotMock.on(AttachPolicyCommand).resolves({});
    iotMock.on(DescribeEndpointCommand).resolves({
      endpointAddress: "endpointAddress",
    });
    const iotResult = await callLambda(
      registerIot,
      apiEvent({
        pathParameters: {
          id: shipId,
        },
        body: {
          csr: csrData,
        },
      }),
    );

    if (typeof iotResult !== "object") {
      fail("iotResult is not an object");
    }

    expect(iotResult.statusCode).toBe(200);
    expect(JSON.parse(iotResult.body!)).toEqual({
      iot_endpoint: "endpointAddress",
      certificate: "certificatePem",
      ca_certificate: expect.any(String),
    });
  });
});