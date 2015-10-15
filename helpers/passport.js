var RESPONSES = require('../constants/responseMessages');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var TABLES = require('../constants/tables');
var CryptoPass = require('../helpers/cryptoPass');
var cryptoPass = new CryptoPass();

module.exports = function (PostGre) {

    var User = PostGre.Models[TABLES.USERS];
    var error;

    passport.use(new LocalStrategy(
        function(username, password, done) {

            User.findByEmail(username, function (err, user) {
                if (err) {

                    return done(err);
                }

                password = cryptoPass.getEncryptedPass(password);

                if (!user) {

                    error = new Error(RESPONSES.INCORRECT_LOGIN_PASS);
                    error.status = 400;

                    return done(error);
                }

                if (user && user.attributes.password !== password) {

                    error = new Error(RESPONSES.INCORRECT_LOGIN_PASS);
                    error.status = 400;

                    return done(error);
                }

                return done(null, user);
            });
        }
    ));

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });


    passport.deserializeUser(function (id, done) {

        User.findById(id, function (err, user) {
            if (err) {

                return done(err);
            }

            done(null, user);
        });

    });

    return passport;
};