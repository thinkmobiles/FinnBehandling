
var RESPONSES = require('../constants/responseMessages');
var CONSTANTS = require('../constants/constants');
var TABLES = require('../constants/tables');

//helpers

/**
 * @description  Treatments and subtreatments module
 * @module treatmentsSubtreatments
 *
 */

var Treatments = function (PostGre) {

    var Treatments = PostGre.Models[TABLES.TREATMENTS_LIST];
    var SubTreatment = PostGre.Models[TABLES.SUB_TREATMENTS_LIST];

    /*this.getAllHospitalTreatments = function (req, res, next){

        /!**
         * __Type__ `GET`
         * __Content-Type__ `application/json`
         *
         * This __method__ allows get _one static_ entry
         *
         * @example Request example:
         *         http://192.168.88.250:8787/staticData
         *
         * @example Response example:
         *
         * {
         *       "id": 1,
         *       "text": "Some text"
         * }
         *
         * @param {number} id - id of article
         * @method getStaticData
         * @instance
         *!/

        var hospitalId = req.params.id;

        HospitalSubTreatment
            .query(function (qb) {
                qb.select(PostGre.knex.raw('array_agg(tb_treatments_dic.id)'));
                qb.where('tb_hospital_sub_treatments.hospital_id', hospitalId);
                qb.leftJoin('tb_treatments_dic', 'tb_treatments_dic.id', 'tb_hospital_sub_treatments.treatment_id');
            })
            .fetch()
            .then(function (clients) {

                res.status(200).send(clients);
            })
            .otherwise(next);

    };*/

    this.getAllTreatments = function (req, res, next){

        /**
         * __Type__ `GET`
         * __Content-Type__ `application/json`
         *
         * This __method__ allows get _all treatments_
         *
         * @example Request example:
         *         http://192.168.88.250:8787/treatment
         *
         * @example Response example:
         *
         * [
         *      {
         *        "id": "1",
         *        "name": "treatment1"
         *      },
         *      {
         *        "id": "2",
         *        "name": "treatment2"
         *      }
         * ]
         *
         * @method getAllTreatments
         * @instance
         */

        Treatments
            .forge()
            .fetchAll()
            .asCallback(function (err, treatments) {

                if(err) {
                    return next(err);
                }

                res.status(200).send(treatments);
            });
    };

    this.getAllSubtreatments = function (req, res, next) {

        /**
         * __Type__ `GET`
         * __Content-Type__ `application/json`
         *
         * This __method__ allows get _all_subtreatments_by_treatment_Id_
         *
         * @example Request example:
         *         http://192.168.88.250:8787/treatment/:id
         *
         * @example Response example:
         *
         * [
         *      {
         *        "id": "1",
         *        "name": "sub_treatment1",
         *        "treatment_id": "1"
         *      },
         *      {
         *        "id": "2",
         *        "name": "sub_treatment2",
         *        "treatment_id": "2"
         *      }
         * ]
         * @param {number} id - id of treatment
         * @method getAllSubtreatments
         * @instance
         */

        var treatmentId = req.params.id;

        SubTreatment
            .forge({treatment_id: treatmentId})
            .fetchAll()
            .asCallback(function (err, subtreatments) {

                if (err) {
                    return next(err);
                }

                res.status(200).send(subtreatments);
            });
    };
};

module.exports = Treatments;
