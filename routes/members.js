/**
 * Created by Ivan on 12.03.2015.
 */
var express = require('express');
var router = express.Router();
var MembersHandler = require('../handlers/members');

module.exports = function (PostGre) {
    var membersHandler = new MembersHandler(PostGre);

    router.get('/', function (req, res, next) {
        res.status(200).send('TEST')
    });



    return router;
};


