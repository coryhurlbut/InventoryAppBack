//Import dependencies
const express   = require('express');
const mongoose  = require('mongoose');
const dotenv    = require('dotenv');
const https     = require('https');
const fs        = require('fs');
const cors      = require('cors');
const PROD_ENV  = true;  // change to false for test environment

//Declare constants
const httpsPort = 8000;

//Import routes
const authRoute         = require('./routes/authRoutes');
const userRoute         = require('./routes/userRoutes');
const itemRoute         = require('./routes/itemRoutes');
const itemLogRoute      = require('./routes/itemLogRoutes');
const adminLogRoute     = require('./routes/adminLogRoutes');
const res = require('express/lib/response');

//Initialize express app and load environment variables
app = express();
dotenv.config();

//Read selfsigned cert and key
var key     = fs.readFileSync(__dirname + '/certs/key.pem');
var cert    = fs.readFileSync(__dirname + '/certs/cert.pem');
var credentials = {
    key: key,
    cert: cert
}
var CABundle = fs.readFileSync(__dirname + '/certs/rds-combined-ca-us-gov-bundle.pem');

//Middlewares
app.use(express.json());    //Formats all response data to JSON
app.use(cors());            //Accepts all CORS requests
app.options('*', cors());

//Route Middlewares - routes requests with url indicated to route indicated
app.use('/auth',            authRoute);
app.use('/users',           userRoute);
app.use('/items',           itemRoute);
app.use('/logs/itemLogs',   itemLogRoute);
app.use('/logs/adminLogs',  adminLogRoute);
 
app.use((req, res, next) => {
    const error = new Error('Route not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message:    error.message,
            instance:   error.instance || 'unknown',
            status:     error.status
        }
    });
});

//Connect to DB
if (PROD_ENV) {
    mongoose.connect(process.env.DB_CONNECTION_PROD, {
        ssl: true,
        sslCA: CABundle,
        sslValidate: false,
        useUnifiedTopology: true,
        useNewUrlParser: true
    }).catch(e => console.log(`[ERROR]: ${e}`));
} else {
    mongoose.connect(process.env.DB_CONNECTION_DEV, { useNewUrlParser: true });
}

//Create and run https server
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(httpsPort, () => {
    console.log('Listening on port 8000');
});