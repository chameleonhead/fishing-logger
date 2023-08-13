import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { convertToAttr, unmarshall } from "@aws-sdk/util-dynamodb";
import { TimestreamQuery } from "@aws-sdk/client-timestream-query";

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

  const ship = unmarshall(result!.Item!);

  const timestreamQuery = new TimestreamQuery({
    endpoint: process.env.TIMESTREAM_ENDPOINT,
    region: process.env.AWS_REGION,
  });

  const logs = await timestreamQuery.query({
    QueryString: `SELECT CREATE_TIME_SERIES(time, measure_value::varchar) FROM ${process.env.TIMESTREAM_DATABASE}.${process.env.TIMESTREAM_TABLE_SHIPS_POSITION} WHERE measure_name = 'position' AND time > ago(12h) AND id = '${ship.id}' GROUP BY id`,
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

  const timeSeries = logs.Rows![0].Data![0].TimeSeriesValue!;

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      logs: timeSeries.map((row) => {
        return {
          time: row.Time,
          position: JSON.parse(row.Value!.ScalarValue!),
        };
      }),
    }),
  };
};
