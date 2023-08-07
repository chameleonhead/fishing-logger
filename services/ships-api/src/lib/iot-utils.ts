import { IoT } from "@aws-sdk/client-iot";
import fetch from 'node-fetch';

export const getCaCertificate = async () => {
  const response = await fetch('https://www.amazontrust.com/repository/AmazonRootCA1.pem', {
    method: 'GET',
  }).then((res) => res.text());

  return {
    caCertificate: response,
  }
}

export const getIotConfigurations = async () => {
  const iot = new IoT({
    endpoint: process.env.IOT_ENDPOINT,
    region: process.env.AWS_REGION
  });
  const { endpointAddress } = await iot.describeEndpoint({ endpointType: 'iot:Data-ATS' });

  return {
    iot_endpoint: endpointAddress,
    topic_prefix: `${process.env.IOT_THING_GROUP_NAME!}/`,
  }
}

export const createCertificateFromCsr = async (csr: string) => {
  const iot = new IoT({
    endpoint: process.env.IOT_ENDPOINT,
    region: process.env.AWS_REGION
  });
  const { certificateArn, certificateId, certificatePem } = await iot.createCertificateFromCsr({
    certificateSigningRequest: csr,
    setAsActive: true,
  });
  return {
    certificateArn: certificateArn!,
    certificateId: certificateId!,
    certificatePem: certificatePem!,
  };
}

export const createKeysAndCertificate = async () => {
  const iot = new IoT({
    endpoint: process.env.IOT_ENDPOINT,
    region: process.env.AWS_REGION
  });
  const { certificateArn, certificateId, certificatePem, keyPair } = await iot.createKeysAndCertificate({
    setAsActive: true,
  });
  return {
    certificateArn: certificateArn!,
    certificateId: certificateId!,
    certificatePem: certificatePem!,
    keyPair: keyPair!,
  };
}

export const deleteCertificate = async (certificateId: string) => {
  const iot = new IoT({
    endpoint: process.env.IOT_ENDPOINT,
    region: process.env.AWS_REGION
  });
  await iot.updateCertificate({
    certificateId,
    newStatus: 'INACTIVE',
  });
  await iot.deleteCertificate({
    certificateId,
  });
}

export const ensureThingExists = async (thingName: string) => {
  const iot = new IoT({
    endpoint: process.env.IOT_ENDPOINT,
    region: process.env.AWS_REGION
  });
  try {
    await iot.describeThing({
      thingName: `${process.env.IOT_THING_GROUP_NAME!}-${thingName}`,
    });
  } catch (error: any) {
    if (error.name !== 'ResourceNotFoundException') {
      throw error;
    }
    await iot.createThing({
      thingName: `${process.env.IOT_THING_GROUP_NAME!}-${thingName}`,
    });
  }
  await iot.addThingToThingGroup({
    thingGroupName: process.env.IOT_THING_GROUP_NAME!,
    thingName: `${process.env.IOT_THING_GROUP_NAME!}-${thingName}`,
  })
}

export const deleteThing = async (thingName: string) => {
  const iot = new IoT({
    endpoint: process.env.IOT_ENDPOINT,
    region: process.env.AWS_REGION
  });
  await iot.removeThingFromThingGroup({
    thingGroupName: process.env.IOT_THING_GROUP_NAME!,
    thingName: `${process.env.IOT_THING_GROUP_NAME!}-${thingName}`,
  })
  await iot.deleteThing({
    thingName: `${process.env.IOT_THING_GROUP_NAME!}-${thingName}`,
  });
}

export const attachCertificateToThing = async (certificateArn: string, thingName: string) => {
  const iot = new IoT({
    endpoint: process.env.IOT_ENDPOINT,
    region: process.env.AWS_REGION
  });
  await iot.attachThingPrincipal({
    thingName: `${process.env.IOT_THING_GROUP_NAME!}-${thingName}`,
    principal: certificateArn,
  });
  await iot.attachPolicy({
    policyName: process.env.IOT_POLICY_NAME!,
    target: certificateArn,
  });
}

export const detachCertificateFromThing = async (thingName: string, certificateArn: string) => {
  const iot = new IoT({
    endpoint: process.env.IOT_ENDPOINT,
    region: process.env.AWS_REGION
  });
  await iot.detachPolicy({
    policyName: process.env.IOT_POLICY_NAME!,
    target: certificateArn,
  });
  await iot.detachThingPrincipal({
    thingName: `${process.env.IOT_THING_GROUP_NAME!}-${thingName}`,
    principal: certificateArn,
  });
}