var express = require('express');

// Initialization
var app = express();

app.get('/', (request, response, next) => {

    response.status(200).json({
        ok: true,
        message: 'Request success'
    });

});

module.exports = app;