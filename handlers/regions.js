var RESPONSES = require('../constants/responseMessages');
var CONSTANTS = require('../constants/constants');
var TABLES = require('../constants/tables');
var regionsImport = require('../helpers/importRegions/import');

/**
 * @description  Regions management module
 * @module regions
 *
 */

var Regions = function (PostGre) {

    var RegionsList = PostGre.Models[TABLES.REGIONS_LIST];

    this.getFylkes = function (req, res, next){

        /**
         * __Type__ `GET`
         * __Content-Type__ `application/json`
         *
         * This __method__ allows get _all fylkes_
         *
         * @example Request example:
         *         http://192.168.88.250:8787/regions/fylkes
         *
         * @example Response example:
         *
         * [
         *  {"fylke":"Hordaland"},
         *  {"fylke":"Buskerud"},
         *  {"fylke":"Finnmark"},
         *
         *  ...
         *
         *  {"fylke":"Nord-Trøndelag"}
         *  ]
         *
         *  Can take optional query parameter `postCode` and return one "fylke" by postcode
         *
         *  @example Request example:
         *         http://192.168.88.250:8787/regions/fylkes?postCode=1111
         *
         * @example Response example:
         *
         *  {"fylke":"Hordaland"}
         *
         * @method getFylkes
         * @instance
         */

        var postCode = req.query.postCode;

        RegionsList
            .query(function (qb) {
                if(postCode){
                    qb.where('postnummer', postCode)
                }
                qb.whereNot('fylke', null);
                qb.distinct('fylke');
                qb.select('fylke', 'kommunenavn');
            })
            .fetchAll()
            .asCallback(function(err, result){

                if (err) {
                    return next(err);
                }

                result = result.length > 1 ? result : result.toJSON()[0] || {};

                res.status(200).send(result);
            });
    };

    this.updateRegionsDB = function (req, res, next){

        /**
         * __Type__ `POST`
         * __Content-Type__ `application/json`
         *
         * This __method__ allows update _regions data in DB from www.bring.no_
         *
         * @example Request example:
         *         http://192.168.88.250:8787/regions/updateDB
         *
         * @example Response example:
         *
         * {
         *     "success": "Regions DB Was Successfully Updated"
         * }
         *
         *
         * @method updateRegionsDB
         * @instance
         */

        regionsImport.updateRegions(PostGre.knex, function (err) {
            if (err) {
                return next(err);
            }

            regionsImport.setFylkes(PostGre.knex, function (err) {
                if (err) {
                    return next(err);
                }

                res.status(200).send({success: RESPONSES.UPDATED_REGIONS_DB_SUCCESS});
            });
        });
    };
};

module.exports = Regions;