import * as uuid from "uuid";
import AWS from "aws-sdk";

export const initiateUpload: AWSLambda.APIGatewayProxyHandlerV2 = (
  event,
  context,
  callback
) => {
  const dynamoDb = new AWS.DynamoDB.DocumentClient();
  const s3 = new AWS.S3();
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body!);

  const id = uuid.v4();
  const uploadKey = "uploads/" + id;
  s3.createPresignedPost(
    {
      Bucket: process.env.S3_BUCKET!,
      Fields: {
        Key: uploadKey,
      },
    },
    (error, result) => {
      // handle potential errors
      if (error) {
        console.error(error);
        callback(new Error("Couldn't start upload."));
        return;
      }
      const params = {
        TableName: process.env.DYNAMODB_TABLE!,
        Item: {
          id: uploadKey,
          data: {
            ...data,
            id: uuid.v4(),
          },
          url: result.url,
          fields: result.fields,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      };

      // write the catch to the database
      dynamoDb.put(params, (error, result) => {
        // handle potential errors
        if (error) {
          console.error(error);
          callback(new Error("Couldn't create the catch item."));
          return;
        }

        // create a response
        const response = {
          statusCode: 200,
          body: JSON.stringify(params.Item),
        };
        callback(null, response);
      });
    }
  );
};
