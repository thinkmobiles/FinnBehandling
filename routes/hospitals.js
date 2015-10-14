var express = require('express');
var hospitalsRouter = express.Router();
var HospitalsHandler = require('../handlers/hospitals');

module.exports = function (PostGre) {
    var hospitalsHandler = new HospitalsHandler(PostGre);

    hospitalsRouter.route('/').post(hospitalsHandler.createHospital);
    hospitalsRouter.route('/').get(hospitalsHandler.getAllHospitals);

    hospitalsRouter.route('/count').get(hospitalsHandler.getHospitalsCount);

    hospitalsRouter.route('/:id').get( hospitalsHandler.getHospital);
    hospitalsRouter.route('/:id').delete(hospitalsHandler.deleteHospital);
    hospitalsRouter.route('/:id').put(hospitalsHandler.updateHospital);

    return hospitalsRouter;
};


