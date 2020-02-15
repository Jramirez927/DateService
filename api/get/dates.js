'use strict';

const AWS = require('aws-sdk')
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.getDate = (event, context, callback) => {
  const params = {
    TableName: process.env.DATE_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
  };

  dynamoDb.get(params).promise()
    .then(result => {
      const response = {
        statusCode: 200,
        body: JSON.stringify(result.Item),
      };
      callback(null, response);
    })
    .catch(error => {
      console.error(error);
      callback(new Error('Couldn\'t fetch candidate.'));
      return;
    });
};

