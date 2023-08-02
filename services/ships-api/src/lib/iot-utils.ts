import { IoT } from "@aws-sdk/client-iot";
import fetch from 'node-fetch';

export const getIotConfigurations = async () => {
  const iot = new IoT({
    endpoint: process.env.IOT_ENDPOINT,
    region: process.env.AWS_REGION
  });
  const { endpointAddress } = await iot.describeEndpoint({ endpointType: 'iot:Data-ATS' });
  const response = await fetch('https://www.amazontrust.com/repository/AmazonRootCA1.pem', {
    method: 'GET',
  }).then((res) => res.text());

  return {
    iotEndpoint: endpointAddress,
    caCertificate: response,
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

export const ensureThingExists = async (thingName: string) => {
  const iot = new IoT({
    endpoint: process.env.IOT_ENDPOINT,
    region: process.env.AWS_REGION
  });
  let thingArn: string;
  try {
    const thing = await iot.describeThing({
      thingName: `${process.env.IOT_THING_GROUP_NAME!}-${thingName}`,
    });
    thingArn = thing.thingArn!;
  } catch (error) {
    console.log(error);
    const thing = await iot.createThing({
      thingName: `${process.env.IOT_THING_GROUP_NAME!}-${thingName}`,
    });
    thingArn = thing.thingArn!;
  }
  await iot.addThingToThingGroup({
    thingGroupName: process.env.IOT_THING_GROUP_NAME!,
    thingName: `${process.env.IOT_THING_GROUP_NAME!}-${thingName}`,
  })
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