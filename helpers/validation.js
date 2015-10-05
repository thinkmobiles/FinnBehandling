var async = require('async');

function Check(validJSON, objectOfValidationFunctions) {
    var self = this;

    this.run = function () {
        var errors;
        var saveModelOptions = {};
        var result;
        var key;
        var argsLength = arguments.length;
        var options;
        var settings;
        var callback;

        if (argsLength === 3) {
            options = arguments[0];
            settings = arguments[1];
            callback = arguments[2];

        } else {

            options = arguments[0];
            callback = arguments[argsLength - 1];
        }

        if (typeof callback !== 'function') {
            errors = new Error(typeof callback + ' is not a function');
            throw errors;
        }

        if (settings && !!settings.withoutValidation) {

            return callback(null, options);
        }

        for (key in validJSON) {

            validJSON[key].forEach(function (element) {

                if (options.hasOwnProperty(key)) {

                    result = self[element](options[key]);

                    if (typeof result !== 'undefined' && result !== null) {
                        saveModelOptions[key] = result;

                    } else {

                        if (errors) {
                            errors += key + ': The validation "' + element + '" failed.\r\n';
                            throw new Error(errors);

                        } else {
                            errors = key + ': The validation "' + element + '" failed.\r\n';
                            throw new Error(errors);
                        }
                    }
                } else if (element === 'required') {

                    if (errors) {
                        errors += key + ': The validation "' + element + '" failed.\r\n';
                        throw new Error(errors);

                    } else {
                        errors = key + ': The validation "' + element + '" failed.\r\n';
                        throw new Error(errors);
                    }
                }
            })
        }

        if (!errors && !Object.keys(saveModelOptions).length) {
            errors = 'Save object is empty, wrong name of fields';
            throw new Error(errors);
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

        if (typeof val === 'undefined' && val !== null) {
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

        if (val !== null && typeof val !== 'undefined') {

            if (isNaN(+val)) {
                return null;

            } else {
                return +val;
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

    isArray: function (val) {
        if (Object.prototype.toString.call(val).slice(8,-1) === 'Array') {
            return val;
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