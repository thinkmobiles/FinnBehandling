var express = require('express');
var router = express.Router();
var HospitalsHandler = require('../handlers/hospitals');

module.exports = function (PostGre) {
    var hospitalsHandler = new HospitalsHandler(PostGre);

    router.post('/', hospitalsHandler.createHospital);

    router.get('/', hospitalsHandler.getAllHospitals);
    router.get('/:id', hospitalsHandler.getHospital);

    router.delete('/:id', hospitalsHandler.deleteHospital);

    router.put('/:id', hospitalsHandler.updateHospital);



    return router;
};


