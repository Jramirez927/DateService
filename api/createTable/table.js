const AWS = require('aws-sdk');
const ddbGeo = require('dynamodb-geo');

const ddb = new AWS.DynamoDB({ endpoint: new AWS.Endpoint('dynamodb.us-east-1.amazonaws.com') });
const config = new ddbGeo.GeoDataManagerConfiguration(ddb, 'DateService-dev');


module.exports.newTable = (event, context, callback) => {

    config.hashKeyLength = 5;
    // Use GeoTableUtil to help construct a CreateTableInput.
    const createTableInput = ddbGeo.GeoTableUtil.getCreateTableRequest(config);

    // Tweak the schema as desired
    createTableInput.ProvisionedThroughput.ReadCapacityUnits = 2;

    console.log('Creating table with schema:');
    console.dir(createTableInput, { depth: null });

    // Create the table
    ddb.createTable(createTableInput).promise()
        // Wait for it to become ready
        .then(function () { return ddb.waitFor('tableExists', { TableName: config.tableName }).promise() })
        .then(function () { console.log('Table created and ready!') });

};