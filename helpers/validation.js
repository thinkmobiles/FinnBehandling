var async = require('../node_modules/async');

function Check(validJSON, objectOfValidationFunctions) {
    var self = this;

    this.run = function (options, callback, settings) {
        var errors;
        var saveModelOptions = {};
        var result;
        var objectRule;
        var key;

        if (settings && !!settings.withoutValidation) {

            return callback(null, options);
        }

        for (key in validJSON) {

            validJSON[key].forEach(function (element) {

                if (options.hasOwnProperty(key)) {

                    result = self[element](options[key]);

                    if (typeof result !== 'undefined') {
                        saveModelOptions[key] = result;

                    } else {

                        if (errors) {
                            errors += key + ': The validation "' + element + '" failed.\r\n';

                        } else {
                            errors = key + ': The validation "' + element + '" failed.\r\n';
                        }
                    }
                } else if (element === 'required') {

                    if (errors) {
                        errors += key + ': The validation "' + element + '" failed.\r\n';

                    } else {
                        errors = key + ': The validation "' + element + '" failed.\r\n';
                    }
                }
            })
        }

        if (!errors && !Object.keys(saveModelOptions).length) {
            errors = 'Save object is empty, wrong name of fields';
        }

        if (settings) {

            if (settings.checkFunctions && settings.checkFunctions.length) {

                async.each(settings.checkFunctions, function (checkFunctionName, callback) {

                    //TODO check if is a function objectOfValidationFunctions[checkFunctionName]
                    if (objectOfValidationFunctions[checkFunctionName]) {

                        objectOfValidationFunctions[checkFunctionName](options, saveModelOptions, callback);

                    } else {
                        callback();
                    }
                }, function (errors) {

                    if (errors) {
                        callback(errors);

                    } else {
                        callback(null, saveModelOptions);
                    }
                });

            } else {
                callback();
            }

        } else {
            callback(null, saveModelOptions);
        }

    };
}

Check.prototype = {

    required: function (val) {

        if (val === undefined && val !== null) {
            return null;
        } else {
            return val;
        }
    },

    isEmail: function (val) {
        var regexp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (regexp.test(val)) {
            return val;
        }
    },

    isInt: function (val) {

        if (val !== null && val !== undefined) {

            if (val === null) {
                return null;

            } else {
                return parseInt(val);
            }
        }
    },

    isFloat: function (val) {

        if (!isNaN(+val)) {
            return parseFloat(val);
        }
    },

    isDate: function (val) {

        if (val instanceof Date) {

            if (!isNaN(val.valueOf())) {
                return val;
            }

        } else {
            var date = new Date(val);

            if (!isNaN(date.valueOf())) {
                return date;
            }
        }
    },

    isBoolean: function (val) {
        if (typeof(val) === 'boolean') {
            return val;
        } else if (val === 'true' || val === 'false') {
            return Boolean(val);
        }
    },

    isString: function (val) {
        if (typeof(val) === 'string' || typeof(val) === 'number') {
            return val + '';
        }
    },

    isTime: function (val) {
        var regexp = /^(?:2[0-3]|[01]?[0-9]):[0-5][0-9]:[0-5][0-9]$/;
        if (regexp.test(val)) {
            return val;
        }
    },

    isNotNull: function (val) {
        if (val !== 'null' && val !== null) {
            return val
        }
    },

    isNotEmptyString: function (val) {
        if (typeof val === 'string' && val !== '') {
            return val
        }
    },

    isPhone: function (val) {
        var regexp = /^\+[1-9]\d{4,14}$/;

        if (regexp.test(val)) {
            return val;
        }
    }
};

module.exports.Check = Check;