// Requires
var express = require('express');
var mongoose = require('mongoose');

// Initialization
var app = express();

// DB Connection
mongoose.connection.openUri('mongodb://localhost:27017/HospitalDB', (error, response) => {

    if (error) throw error;

    console.log('Database on port 27017: \x1b[32m%s\x1b[0m', 'online');

});


// Routes
app.get('/', (request, response, next) => {

    response.status(200).json({
        ok: true,
        message: 'Request success'
    });

});

// Listenters
app.listen(3000, () => {
    console.log('Express server running on port 3000: \x1b[32m%s\x1b[0m', 'online');
});