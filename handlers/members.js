var RESPONSES = require('../constants/responseMessages');
var CONSTANTS = require('../constants/constants');
var TABLES = require('../constants/tables');


var crypto = require("crypto");
var async = require('../node_modules/async');
var _ = require('../node_modules/underscore');


//helpers
var MembersValidation = require('../helpers/validation');
var generator = require('../helpers/randomPass.js');
var Mailer = require('../helpers/mailer.js');


var redisClient = require('../helpers/redisClient')();

var Members;

Members = function (PostGre) {


};

module.exports = Members;

