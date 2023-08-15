import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { convertToAttr, unmarshall } from "@aws-sdk/util-dynamodb";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const dynamoDb = new DynamoDB({
    endpoint: process.env.DYNAMODB_ENDPOINT,
    region: process.env.AWS_REGION,
  });
  const params = {
    TableName: process.env.DYNAMODB_TABLE!,
    Key: {
      id: convertToAttr(event.pathParameters!.id),
    },
  };

  // fetch ship from the database
  const result = await dynamoDb.getItem(params);

  if (!result.Item) {
    return {
      statusCode: 404,
      headers: { "Content-Type": "text/plain" },
      body: "Ship not found.",
    };
  }

  // create a response
  const ship = unmarshall(result!.Item!);

  // fetch ship state from the database
  const paramsSignalKState = {
    TableName: process.env.DYNAMODB_TABLE!,
    Key: {
      id: convertToAttr("signalk:" + ship.id),
    },
  };
  const resultData = {} as { signalk?: object & { id?: string }; iot?: object };
  const resultSignalKState = await dynamoDb.getItem(paramsSignalKState);
  if (resultSignalKState.Item) {
    resultData.signalk = unmarshall(resultSignalKState!.Item!);
    delete resultData.signalk.id;
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(resultData),
  };
};
