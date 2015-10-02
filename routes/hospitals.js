var express = require('express');
var hospitalsRouter = express.Router();
var HospitalsHandler = require('../handlers/hospitals');

module.exports = function (PostGre) {
    var hospitalsHandler = new HospitalsHandler(PostGre);

    hospitalsRouter.route('/')
        .post(hospitalsHandler.createHospital)
        .get(hospitalsHandler.getAllHospitals);

    hospitalsRouter.route('/:id')
        .get( hospitalsHandler.getHospital)
        .delete(hospitalsHandler.deleteHospital)
        .put(hospitalsHandler.updateHospital);

    return hospitalsRouter;
};


