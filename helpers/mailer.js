var _ = require('underscore');
var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
var CONSTANTS = require('../constants/constants');
var redisClient = require('../helpers/redisClient')();
var async = require('async');
var logWriter = require('../helpers/logWriter')();

var TEST_EMAIL = 'test@kemblajoggers.club';

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

    this.sendMemberPassword = function (options) {
        var templateOptions = {
            firstName: options.firstName[0].toUpperCase() + options.firstName.substr(1), //options.firstName,
            lastName: options.lastName[0].toUpperCase() + options.lastName.substr(1), //options.lastName,
            email: options.email,
            password: options.password,
            id: options.id,
            preference: options.preference || 'Random',
            dateOfBirth: options.dateOfBirth,
            year: options.year,
            serie: options.serie,
            location: options.location,
            dateNextEvent: options.dateNextEvent,
            ageGroup: options.ageGroup
        };
        var mailOptions = {
            from: (options.centreName || CONSTANTS.MAILER_DEFAULT_FROM) + '<' + CONSTANTS.MAILER_DEFAULT_EMAIL_ADDRESS + '>',
            to: options.email,
            subject: 'Welcome to Kembla Joggers, ' + options.firstName[0].toUpperCase() + options.firstName.substr(1), //options.firstName,
            generateTextFromHTML: true,
            html: _.template(fs.readFileSync('public/templates/mailer/sendMembersPassword.html', encoding = "utf8"), templateOptions)
        };

        deliver(mailOptions);
    };

    this.sendMailRenew = function (options) {
        var templateOptions = {
            firstName: options.firstName[0].toUpperCase() + options.firstName.substr(1), //options.firstName,
            lastName: options.lastName[0].toUpperCase() + options.lastName.substr(1), //options.lastName,
            email: options.email,
            password: options.password,
            id: options.id,
            preference: options.preference,
            dateOfBirth: options.dateOfBirth,
            year: options.year,
            serie: options.serie,
            location: options.location,
            dateNextEvent: options.dateNextEvent,
            ageGroup: options.ageGroup,
            currentYear: options.currentYear,
            currentSerie: options.currentSerie
        };

        var mailOptions = {
            from: (options.centreName || CONSTANTS.MAILER_DEFAULT_FROM) + '<' + CONSTANTS.MAILER_DEFAULT_EMAIL_ADDRESS + '>',
            to: options.email,
            subject: 'Welcome back to Kembla Joggers, ' + options.firstName[0].toUpperCase() + options.firstName.substr(1), //options.firstName,
            generateTextFromHTML: true,
            html: _.template(fs.readFileSync('public/templates/mailer/sendMailRenew.html', encoding = "utf8"), templateOptions)
        };

        deliver(mailOptions);
    };

    this.sendResult = function (options) {
        var serie;
        if (options.SerieType === CONSTANTS.SERIE_TYPE.WINTER) {
            serie = CONSTANTS.SERIE_NAME.WINTER;
        } else if (options.SerieType === CONSTANTS.SERIE_TYPE.SUMMER) {
            serie = CONSTANTS.SERIE_NAME.SUMMER;
        } else {
            serie = CONSTANTS.SERIE_NAME.TRACK;
        }

        var templateOptions = {
            firstName: options.FirstName[0].toUpperCase() + options.FirstName.substr(1), //options.FirstName,
            email: options.Email,
            count: options.Count,
            position: options.Position,
            location: options.Location,
            runTime: options.RunningTime,
            course: options.Course,
            futureDate: options.FutureDate || 'Random Date',
            futureLocation: options.FutureLocation || 'Random Location',
            serie: serie
        };
        var mailOptions = {
            from: (options.centreName || CONSTANTS.MAILER_DEFAULT_FROM) + '<' + CONSTANTS.MAILER_DEFAULT_EMAIL_ADDRESS + '>',
            to: TEST_EMAIL || options.Email,
            subject: 'Thank you for running with Kembla Joggers today ' + options.FirstName[0].toUpperCase() + options.FirstName.substr(1), //options.FirstName,
            generateTextFromHTML: true
        };
        if (options.MembershipType === CONSTANTS.MEMBERSHIP_TYPE.GUEST) {
            mailOptions.html = _.template(fs.readFileSync('public/templates/mailer/sendGuestResults.html', encoding = "utf8"), templateOptions)
        } else {
            mailOptions.html = _.template(fs.readFileSync('public/templates/mailer/sendResults.html', encoding = "utf8"), templateOptions)
        }

        logWriter.log('SUCCESS RESULT MAILING sendResult', mailOptions.to);

        deliver(mailOptions);
    };

    this.sendFamilyResult = function (options) {
        var serie;
        if (options.SerieType === CONSTANTS.SERIE_TYPE.WINTER) {
            serie = CONSTANTS.SERIE_NAME.WINTER;
        } else if (options.SerieType === CONSTANTS.SERIE_TYPE.SUMMER) {
            serie = CONSTANTS.SERIE_NAME.SUMMER;
        } else {
            serie = CONSTANTS.SERIE_NAME.TRACK;
        }

        var templateOptions = {
            firstName: options[0].FirstName[0].toUpperCase() + options[0].FirstName.substr(1), //options[0].FirstName,
            email: options[0].Email,
            count: options[0].Count,
            position: options[0].Position,
            location: options[0].Location,
            runTime: options[0].RunningTime,
            course: options[0].Course,
            futureDate: options[0].FutureDate || 'Random Date',
            futureLocation: options[0].FutureLocation || 'Random location',
            serie: serie
        };
        var membersResults = '<table border="1">';
        options.shift();
        options.forEach(function (member) {
            membersResults += '<tr><td>' + member.FirstName + '</td><td>' + member.Course + '</td><td>' + member.RunningTime + '</td><td>' + member.Position + '</td></tr>'
        });
        membersResults += '</table>';
        templateOptions.membersResultsHtml = membersResults;

        var mailOptions = {
            from: (options.centreName || CONSTANTS.MAILER_DEFAULT_FROM) + '<' + CONSTANTS.MAILER_DEFAULT_EMAIL_ADDRESS + '>',
            to: TEST_EMAIL || templateOptions.email,
            subject: 'Your results for your races today with Kembla Joggers, ' + templateOptions.firstName[0].toUpperCase() + templateOptions.firstName.substr(1), //templateOptions.firstName,
            generateTextFromHTML: true,
            html: _.template(fs.readFileSync('public/templates/mailer/sendFamilyResults.html', encoding = "utf8"), templateOptions)
        };

        logWriter.log('SUCCESS RESULT MAILING sendFamilyResult', mailOptions.to);

        deliver(mailOptions);
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

