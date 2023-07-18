import AWS from "aws-sdk";

export const handler: AWSLambda.APIGatewayProxyHandlerV2 = (
  event,
  context,
  callback
) => {
  const dynamoDb = new AWS.DynamoDB.DocumentClient();
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body!);
  const params = {
    TableName: process.env.DYNAMODB_TABLE!,
    Key: {
      id: event.pathParameters!.id,
    },
  };

  // fetch catch from the database
  dynamoDb.get(params, (error, result) => {
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

    const params = {
      TableName: process.env.DYNAMODB_TABLE!,
      Key: {
        id: event.pathParameters!.id,
      },
      ExpressionAttributeValues: {
        ":media": (result.Item?.media || []).concat([data]),
        ":updatedAt": timestamp,
      },
      UpdateExpression: "SET media = :media, updatedAt = :updatedAt",
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
          body: "Couldn't update the catch item.",
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
  });
};
