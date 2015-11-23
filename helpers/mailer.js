var _ = require('underscore');
var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
var CONSTANTS = require('../constants/constants');
var redisClient = require('../helpers/redisClient')();
var async = require('async');
var logWriter = require('../helpers/logWriter')();

var TEST_EMAIL = 'prastiprep@thrma.com';

var Mailer = function (PostGre) {
    var fs = require('fs');

    this.forgotPassword = function (options) {
        var templateOptions = {
            firstName: options.FirstName[0].toUpperCase() + options.FirstName.substr(1), // options.FirstName,
            email: options.Email,
            url: process.env.APP_HOST + '/members/changePassword?forgotToken=' + options.ForgotToken
        };
        var mailOptions = {
            from: (options.centreName || CONSTANTS.MAILER_DEFAULT_FROM) + '<' + CONSTANTS.MAILER_DEFAULT_EMAIL_ADDRESS + '>',
            to: options.Email,
            subject: 'Your Kembla Joggers password has been reset',
            generateTextFromHTML: true,
            html: _.template(fs.readFileSync('public/templates/mailer/forgotPassword.html', encoding = "utf8"), templateOptions)
        };

        deliver(mailOptions);
    };

    this.changePassword = function (options) {
        var templateOptions = {
            name: options.FirstName[0].toUpperCase() + options.FirstName.substr(1), //options.FirstName,
            email: options.Email,
            password: options.Password,
            url: process.env.APP_HOST
        };
        var mailOptions = {
            from: (options.centreName || CONSTANTS.MAILER_DEFAULT_FROM) + '<' + CONSTANTS.MAILER_DEFAULT_EMAIL_ADDRESS + '>',
            to: options.Email,
            subject: 'Change password',
            generateTextFromHTML: true,
            html: _.template(fs.readFileSync('public/templates/mailer/changePassword.html', encoding = "utf8"), templateOptions)
        };

        deliver(mailOptions);
    };

    this.sendEmail = function (options, callback) {

        deliver({
            from: options.email,
            to: TEST_EMAIL,
            subject: options.topic,
            text: options.notification + '\n ' + options.name
        }, callback);
    };


    function deliver(mailOptions, cb) {
        var transport = nodemailer.createTransport(smtpTransport({
            service: 'gmail',
            auth: {
                user: "gogi.gogishvili",
                pass: "gogi123456789"
            }
        }));

        transport.sendMail(mailOptions, function (err, response) {
            if (err) {
                console.log(err);
                if (cb && (typeof cb === 'function')) {
                    cb(err, null);
                }
            } else {
                console.log("Message sent: " + response.message);
                if (cb && (typeof cb === 'function')) {
                    cb(null, response);
                }
            }
        });
    }

};

module.exports = Mailer;

