var express = require('express');
var treatmentRouter = express.Router();
var TreatmentHandler = require('../handlers/treatments');

module.exports = function (PostGre) {
    var treatmentHandler = new TreatmentHandler(PostGre);

    treatmentRouter.route('/').get(treatmentHandler.getAllTreatments);
    treatmentRouter.route('/:id').get(treatmentHandler.getAllSubtreatments);

    return treatmentRouter;
};


