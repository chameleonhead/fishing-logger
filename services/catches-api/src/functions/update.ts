import AWS from "aws-sdk";

const { DynamoDB } = AWS;

const dynamoDb = new DynamoDB.DocumentClient();

export const update = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);

  // validation
  if (typeof event.pathParameters.id !== "undefined") {
    console.error("Validation Failed");
    callback(null, {
      statusCode: 400,
      headers: { "Content-Type": "text/plain" },
      body: "Couldn't update the catch item.",
    });
    return;
  }

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
    ExpressionAttributeValues: {
      ...Object.keys(data).reduce((prev, current) => {
        prev[":" + current] = data[current];
        return prev;
      }, {}),
      ":updatedAt": timestamp,
    },
    UpdateExpression:
      "SET " +
      Object.keys(data)
        .map((key) => `${key} = :${key}`)
        .join(",") +
      ", updatedAt = :updatedAt",
    ReturnValues: "ALL_NEW",
  };

  // update the catch in the database
  dynamoDb.update(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { "Content-Type": "text/plain" },
        body: "Couldn't fetch the catch item.",
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    };
    callback(null, response);
  });
};
