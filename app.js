// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Initialization
var app = express();

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Import Routes
var appRoutes = require('./routes/app-routes');
var userRoutes = require('./routes/user-routes');
var loginRoutes = require('./routes/login-routes');


// DB Connection
mongoose.connection.openUri('mongodb://localhost:27017/HospitalDB', (error, response) => {

    if (error) throw error;

    console.log('Database on port 27017: \x1b[32m%s\x1b[0m', 'online');

});

// Routes
app.use('/user', userRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);



// Listenters
app.listen(3000, () => {
    console.log('Express server running on port 3000: \x1b[32m%s\x1b[0m', 'online');
});