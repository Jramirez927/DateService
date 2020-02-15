const AWS = require('aws-sdk');
const ddbGeo = require('dynamodb-geo');
const uuid = require('uuid');

const ddb = new AWS.DynamoDB({ endpoint: new AWS.Endpoint('dynamodb.us-east-1.amazonaws.com')});

const config = new ddbGeo.GeoDataManagerConfiguration(ddb, 'DateService-dev');
config.hashKeyLength = 5;
const myGeoTableManager = new ddbGeo.GeoDataManager(config);

module.exports.addDate = (event, context, callback) => {
    let data = JSON.parse(event.body);
    let name = data.name;
    let address = data.address;
    let description = data.description;
    let longitude = data.longitude;
    let latitude = data.latitude;

    myGeoTableManager.putPoint({
        RangeKeyValue: { S: uuid.v4() }, // Use this to ensure uniqueness of the hash/range pairs.
        GeoPoint: { // An object specifying latitutde and longitude as plain numbers. Used to build the geohash, the hashkey and geojson data
            latitude: latitude,
            longitude: longitude
        },
        PutItemInput: { // Passed through to the underlying DynamoDB.putItem request. TableName is filled in for you.
            Item: { // The primary key, geohash and geojson data is filled in for you
                name: { S: name }, // Specify attribute values using { type: value } objects, like the DynamoDB API.
                description: { S: description },
                address: {S: address}
            },
            // ... Anything else to pass through to `putItem`, eg ConditionExpression
        }
    }).promise().then(result => {
        const response = {
            statusCode: 200,
            body: "Added successfully"
        };
        callback(null, response);
    })
    .catch(error => {
        console.error(error);
        callback(new Error('Couldn\'t fetch candidate.'));
        return;
    });
};