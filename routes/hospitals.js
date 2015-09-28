var express = require('express');
var router = express.Router();
var HospitalsHandler = require('../handlers/hospitals');

module.exports = function (PostGre) {
    var hospitalsHandler = new HospitalsHandler(PostGre);

    router.post('/', hospitalsHandler.createHospital);

    router.put('/', hospitalsHandler.updateHospital);



    return router;
};


