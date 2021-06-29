//Import dependencies
const express   = require('express');
const mongoose  = require('mongoose');
const dotenv    = require('dotenv');
const https     = require('https');
const http      = require('http');
const fs        = require('fs');
const cors      = require('cors');

//Declare constants
const httpsPort = 8000;
const httpPort = 3000;

//Import routes
const authRoute         = require('./routes/authRoutes');
const userRoute         = require('./routes/userRoutes');
const itemRoute         = require('./routes/itemRoutes');
const itemAssocRoute    = require('./routes/itemAssocRoutes');
const itemLogRoute      = require('./routes/itemLogRoutes');
const adminLogRoute     = require('./routes/adminLogRoutes');
const { nextTick } = require('process');

//Initialize express app and load environment variables
app = express();
dotenv.config();

//Read selfsigned cert and key
var key = fs.readFileSync(__dirname + '/certs/selfsigned.key');
var cert = fs.readFileSync(__dirname + '/certs/selfsigned.crt');
var credentials = {
    key: key,
    cert: cert
};

//Middlewares
app.use(express.json());    //Formats all response data to JSON
app.use(cors());            //Accepts all CORS requests
app.options('*', cors());


//Route Middlewares - routes requests with url indicated to route indicated
app.use('/auth',            authRoute);
app.use('/users',           userRoute);
app.use('/items',           itemRoute);
app.use('/itemAssoc',       itemAssocRoute);
app.use('/logs/itemLogs',   itemLogRoute);
app.use('/logs/adminLogs',  adminLogRoute);

//GET home route
app.get('/', (req, res) => {
    res.send('Hello World.');
});

//Connect to DB
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true },() => {console.log('connected')});

//Create and run https server
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(httpsPort, () => {
    console.log("Https server listening on port : " + httpsPort);
});

//Create and run http server
//var httpServer = http.createServer(app);
// app.listen(httpPort, () => {
//     console.log("Http server listing on port : " + httpPort)
// });