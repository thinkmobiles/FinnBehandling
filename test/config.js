'use strict';
var app;

process.env.NODE_ENV = 'test';
app = require('../app.js');

module.exports = function () {
    this.app = app;
    this.host = 'http://localhost:8790';
};