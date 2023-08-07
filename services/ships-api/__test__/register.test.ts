import { DynamoDB } from "@aws-sdk/client-dynamodb";
import {
  AddThingToThingGroupCommand,
  AttachPolicyCommand,
  AttachThingPrincipalCommand,
  CreateCertificateFromCsrCommand,
  CreateKeysAndCertificateCommand,
  CreateThingCommand,
  DeleteCertificateCommand,
  DeleteThingCommand,
  DescribeEndpointCommand,
  DescribeThingCommand,
  DetachPolicyCommand,
  DetachThingPrincipalCommand,
  IoT,
  RemoveThingFromThingGroupCommand,
  UpdateCertificateCommand,
} from "@aws-sdk/client-iot";
import { mockClient } from "aws-sdk-client-mock";
import { apiEvent, callLambda, ensureTableNoData } from "./utils";
import { generateCSR } from "./csr-utils";
import { handler as createHandler } from "../src/functions/create";
import { handler as activateHandler } from "../src/functions/activate";
import { handler as deactivateHandler } from "../src/functions/deactivate";
import { handler as getConfigHandler } from "../src/functions/get-config";

describe("register a ship", () => {
  const OLD_ENV = process.env;
  const iotMock = mockClient(IoT);

  beforeEach(async () => {
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
    process.env.DYNAMODB_TABLE = "ships-register";
    process.env.IOT_THING_GROUP_NAME = "ships-register"
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
      createHandler,
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
    const iotResult = await callLambda(
      activateHandler,
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
      client_id: `${process.env.IOT_THING_GROUP_NAME!}-${shipId}`,
      certificate: "certificatePem",
      ca_certificate: expect.any(String),
      key_pair: {
        public_key: "PublicKey",
        private_key: "PrivateKey",
      },
    });

    iotMock.on(DescribeEndpointCommand).resolves({
      endpointAddress: "endpointAddress",
    });
    const getConfigResult = await callLambda(
      getConfigHandler,
      apiEvent({
        pathParameters: {
          id: shipId,
        },
      }));
    if (typeof getConfigResult !== "object") {
      fail("getConfigResult is not an object");
    }
    expect(getConfigResult.statusCode).toBe(200);
    expect(JSON.parse(getConfigResult.body!)).toEqual({
      iot_endpoint: "endpointAddress",
      topic_prefix: `${process.env.IOT_THING_GROUP_NAME!}/`,
    });

    iotMock.on(DetachPolicyCommand).resolves({});
    iotMock.on(DetachThingPrincipalCommand).resolves({});
    iotMock.on(UpdateCertificateCommand).resolves({});
    iotMock.on(DeleteCertificateCommand).resolves({});
    iotMock.on(RemoveThingFromThingGroupCommand).resolves({});
    iotMock.on(DeleteThingCommand).resolves({});
    const resultUnregister = await callLambda(
      deactivateHandler,
      apiEvent({ pathParameters: { id: shipId } }),
    );

    if (typeof resultUnregister !== "object") {
      fail("resultUnregister is not an object");
    }
    expect(resultUnregister.statusCode).toBe(204);
  });

  it("should register a ship with iot associated by csr", async () => {
    const dynamoDb = new DynamoDB({
      endpoint: process.env.DYNAMODB_ENDPOINT,
      region: process.env.AWS_REGION,
    });
    await ensureTableNoData(dynamoDb, process.env.DYNAMODB_TABLE!);

    const { csrData } = generateCSR("test");
    const result = await callLambda(
      createHandler,
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
    const iotResult = await callLambda(
      activateHandler,
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
      client_id: `${process.env.IOT_THING_GROUP_NAME!}-${shipId}`,
      certificate: "certificatePem",
      ca_certificate: expect.any(String),
    });
  });
});
