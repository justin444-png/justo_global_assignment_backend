var mysql = require('mysql');
const util = require('util');
const env = require('../config/environ')


var connection = mysql.createConnection({
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME
});
const query = util.promisify(connection.query).bind(connection);
module.exports.connection = connection;
module.exports.query = query;