const express = require('express');
var cors = require('cors');
const swaggerUI = require("swagger-ui-express");
const docs = require('./docs');
const env = require('./src/config/environ.js');
const routes = require('./src/routes');
const db = require('./src/service/dataBase.js');
var bodyParser = require('body-parser');
var multer = require('multer');
const error = require('./src/middleware/error.js');

const connection = db.connection;
connection.connect();
const app = express();

var addHeader = function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
}
var storage = multer.memoryStorage({
    destination: function(req, file, callback) {
        callback(null, '');
    }
});
var upload = multer({ storage: storage }).any();
app.use(upload);
app.use(cors())
app.use(addHeader);
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb', extended: true, verify: (req, res, buf) => { req.rawBody = buf } }))


app.use(error.handler);
app.use('/api', routes);
const PORT =env.PORT;
    app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(docs)); // swagger 

app.listen(PORT, (error) => {
    if (!error)
        console.log(`Server is Successfully Running, and App is listening on port ${PORT}`)
    else
        console.log("Error occurred, server can't start", error);
}
);