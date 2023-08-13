import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { convertToAttr, unmarshall } from "@aws-sdk/util-dynamodb";
import { TimestreamQuery } from "@aws-sdk/client-timestream-query";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const { before, after } = typeof event.queryStringParameters !== "undefined" ? event.queryStringParameters : {} as { before?: string, after?: string };
  if (typeof before !== "undefined" && before.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/) === null) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "text/plain" },
      body: "Invalid before parameter.",
    }
  }
  if (typeof after !== "undefined" && after.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/) === null) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "text/plain" },
      body: "Invalid before parameter.",
    }
  }
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

  const ship = unmarshall(result!.Item!);

  const timestreamQuery = new TimestreamQuery({
    endpoint: process.env.TIMESTREAM_ENDPOINT,
    region: process.env.AWS_REGION,
  });

  let query = `SELECT to_iso8601(time) || 'Z', measure_value::varchar, horizontal_dilution FROM ${process.env.TIMESTREAM_DATABASE}.${process.env.TIMESTREAM_TABLE_SHIPS_POSITION} WHERE measure_name = 'position' AND id = '${ship.id}' AND measure_value::varchar <> '{"longitude":null,"latitude":null}'`;
  if (typeof before !== "undefined") {
    query += ` AND time < from_iso8601_timestamp('${before}')`;
  }
  if (typeof after !== "undefined") {
    query += ` AND time > from_iso8601_timestamp('${after}')`;
  }

  const logs = await timestreamQuery.query({
    QueryString: `${query} ORDER BY time DESC LIMIT 500`,
  });

  if (typeof logs.Rows === "undefined" || logs.Rows.length === 0) {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        logs: [],
      }),
    };
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      logs: logs.Rows.map((row) => {
        return {
          time: row.Data![0].ScalarValue!,
          position: JSON.parse(row.Data![1].ScalarValue!),
        };
      }),
    }),
  };
};
