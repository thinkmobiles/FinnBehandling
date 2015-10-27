var TABLES = require('../constants/tables');
var RESPONSES = require('../constants/responseMessages');
var imageUploaderConfig = {
    type: 'FileSystem',
    directory: 'public'
};
var imageUploader = require('../helpers/imageUploader/imageUploader')(imageUploaderConfig);
var Validation = require('../helpers/validation/main');

function assert(fn) {

    if (typeof fn !== 'function') {
        throw new Error(typeof fn + ' is not a function');
    }
}

module.exports = function (postGre, ParentModel) {

    var validationFunctions = require('../helpers/validation/customFunctions')(postGre);

    return ParentModel.extend({
        idAttribute: 'id',
        hasTimestamps: true,
        tableName: TABLES.HOSPITALS,

        logo: function () {
            return this.morphOne(postGre.Models[TABLES.IMAGES], 'imageable');
        },

        initialize: function () {
            this.on('destroying', this.removeAllDependencies);
        },

        removeAllDependencies: function (model) {

            deleteHospitalLogo(model.id);
        }
    }, {
        create: {
            region_id: ['required', 'isInt'],
            is_paid: ['required', 'isBoolean'],
            type_id: ['required', 'isInt'],
            name: ['required', 'isString'],
            description: ['isString'],
            address: ['isString'],
            phone_number: ['isArray'],
            email: ['isArray'],
            web_address: ['isString'],
            position: ['isPosition']
        },

        update: {
            id: ['required', 'isInt'],
            region_id: ['required', 'isInt'],
            is_paid: ['required', 'isBoolean'],
            type_id: ['required', 'isInt'],
            name: ['required', 'isString'],
            description: ['isString'],
            address: ['isString'],
            phone_number: ['isArray'],
            email: ['isArray'],
            web_address: ['isString'],
            position: ['isPosition']
        },

        getValidated: function (validatePurpose, options, settings, callback) {
            var checkValidatePurpose = validatePurpose === 'create' || validatePurpose === 'update';
            var validationParams = checkValidatePurpose ? this[validatePurpose] : {withoutValidation: true};

            validation(validationParams).run(options, settings, callback);
        },

        createValid: function (options, callback) {

            var self = this;

            assert(callback);

            var settings =  {
                checkFunctions: [
                    'checkHospitalType',
                    'checkHospitalRegion',
                    'checkHospitalTreatment',
                    'checkHospitalSubTreatment',
                    'checkUniqueHospitalName'
                ]
            };

            this.getValidated('create', options, settings, function (err, validOptions) {

                if (err) {
                    return callback(err);
                }

                self.forge()
                    .save(validOptions, {require: true})
                    .asCallback(callback);
            });
        },

        updateValid: function (options, callback) {

            var self = this;

            assert(callback);

            var settings =  {
                checkFunctions: [
                    'checkExistingHospital',
                    'checkHospitalType',
                    'checkHospitalRegion',
                    'checkHospitalTreatment',
                    'checkHospitalSubTreatment',
                    'checkUniqueHospitalName'
                ]
            };

            this.getValidated('update', options, settings, function (err, validOptions) {

                if (err) {
                    return callback(err);
                }

                self.forge({id: validOptions.id})
                    .save(validOptions, {method: 'update', require: true})
                    .asCallback(callback);
            });
        },

        getOne: function(id, callback) {

            assert(callback);

            this.query(function(qb){
                    qb.select(
                        postGre.knex.raw('TO_CHAR( :hospital: .created_at, \'D. Mon YYYY\') AS created_at ',
                            {
                                hospital: TABLES.HOSPITALS
                            }
                        ),

                        postGre.knex.raw(
                            '(SELECT JSON_AGG(treatments_result) ' +
                            '   FROM ( ' +
                            '       SELECT treatment.name ' +
                            '           FROM :treatments_list: treatment ' +
                            '           LEFT JOIN :treatments: hospital_treatment ' +
                            '               ON treatment.id = hospital_treatment.treatment_id ' +
                            '           WHERE hospital_treatment.hospital_id = :hospital: .id ' +
                            '       ) treatments_result ' +
                            ') AS treatments ',

                            {
                                treatments_list: TABLES.TREATMENTS_LIST,
                                treatments: TABLES.TREATMENTS,
                                hospital: TABLES.HOSPITALS
                            }
                        ),

                        postGre.knex.raw(
                            '(SELECT JSON_AGG(sub_treatments_result) ' +
                            '   FROM ( ' +
                            '       SELECT sub_treatment.name ' +
                            '           FROM ' + TABLES.SUB_TREATMENTS_LIST + ' sub_treatment ' +
                            '           LEFT JOIN ' + TABLES.SUB_TREATMENTS + ' hospital_sub_treatment ' +
                            '               ON sub_treatment.id = hospital_sub_treatment.sub_treatment_id ' +
                            '           WHERE hospital_sub_treatment.hospital_id = ' + TABLES.HOSPITALS + '.id ' +
                            '       ) sub_treatments_result ' +
                            ') AS sub_treatments '
                        ),

                        TABLES.HOSPITALS + '.id',
                        TABLES.HOSPITALS + '.is_paid',
                        TABLES.HOSPITALS + '.name',
                        TABLES.HOSPITALS + '.address',
                        TABLES.HOSPITALS + '.phone_number',
                        TABLES.HOSPITALS + '.email',
                        TABLES.HOSPITALS + '.description'
                    );

                    qb.leftJoin(TABLES.HOSPITAL_TYPES_LIST, TABLES.HOSPITAL_TYPES_LIST + '.id', TABLES.HOSPITALS + '.type_id');
                    qb.where(TABLES.HOSPITALS + '.id', id);
                })
                .fetch({
                    withRelated: [
                        'logo'
                    ],
                    require: true
                })
                .asCallback(callback);
        },

        getAll: function (options, callback) {

            assert(callback);

            this.query(function(qb){
                    qb.select(
                        postGre.knex.raw('TO_CHAR( ' + TABLES.HOSPITALS + '.created_at, \'D. Mon YYYY\') AS created_at '),

                        postGre.knex.raw('ST_X(' + TABLES.HOSPITALS + '.position::geometry) AS latitude '),
                        postGre.knex.raw('ST_Y(' + TABLES.HOSPITALS + '.position::geometry) AS longitude '),

                        TABLES.HOSPITALS + '.id',
                        TABLES.HOSPITALS + '.is_paid',
                        TABLES.HOSPITALS + '.name',
                        TABLES.HOSPITALS + '.address',
                        TABLES.HOSPITALS + '.phone_number',
                        TABLES.HOSPITALS + '.email',
                        TABLES.HOSPITALS + '.description'
                    );

                    qb.leftJoin(TABLES.HOSPITAL_TYPES_LIST, TABLES.HOSPITAL_TYPES_LIST + '.id', TABLES.HOSPITALS + '.type_id');
                    qb.orderBy(TABLES.HOSPITALS + '.created_at', 'DESC');
                    qb.limit(options.limit);
                    qb.offset(options.offset);
                })
                .fetchAll({
                    withRelated: [
                        'logo'
                    ]
                })
                .asCallback(callback);
        },

        delete: function (hospitalId, callback) {

            this.forge({
                    id: hospitalId
                })
                .destroy()
                .asCallback(callback);
        }
    });

    function validation (options) {

        return new Validation.Check(options, {
            checkHospitalType: validationFunctions.checkHospitalType,
            checkHospitalRegion: validationFunctions.checkHospitalRegion,
            checkHospitalTreatment: validationFunctions.checkHospitalTreatment,
            checkHospitalSubTreatment: validationFunctions.checkHospitalSubTreatment,
            checkUniqueHospitalName: validationFunctions.checkUniqueHospitalName,
            checkExistingHospital: validationFunctions.checkExistingHospital
        });
    }

    function deleteHospitalLogo (hospitalId) {

        postGre.Models[TABLES.IMAGES]
            .where({
                imageable_id: hospitalId,
                imageable_type: TABLES.HOSPITALS,
                imageable_field: 'logo'
            })
            .fetch()
            .then(function (model) {

                imageUploader.removeImage(model.attributes['name'], 'images', function (err) {

                    if (!err) {

                        model
                            .destroy()
                            .asCallback();
                    }
                });
            });
    }
};