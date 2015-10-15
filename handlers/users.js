var RESPONSES = require('../constants/responseMessages');
var CONSTANTS = require('../constants/constants');
var TABLES = require('../constants/tables');

//helpers

/**
 * @description  User management module
 * @module users
 *
 */

var Users = function (PostGre) {

    var User = PostGre.Models[TABLES.USERS];
    var CryptoPass = require('../helpers/cryptoPass');
    var cryptoPass = new CryptoPass();
    var passport = require('passport');


    this.signIn = function (req, res,next) {

        passport.authenticate('local',
            function (err, user, info) {

                if (err) {

                    return next(err);
                }

                req.logIn(user, function (err) {

                        if (err) {
                            return next(err);
                        }
                        res.redirect('/');
                    }
                );
            })(req, res, next);
    };



    this.getOneUser = function (req, res, next){

        /**
         * __Type__ `GET`
         * __Content-Type__ `application/json`
         *
         * This __method__ allows get _one user profile_
         *
         * @example Request example:
         *         http://192.168.88.250:8787/user/:id
         *
         * @example Response example:
         *
         * {
         *       "id": 3,
         *       "first_name": "John",
         *       "last_name": "Smith",
         *       "uuid": "111111-1111-1111-1111-1111111111",
         *       "email": "john@mail.com",
         *       "updated_at": "2015-09-29T13:48:39.981Z"
         *       "password": "8d969eef6ecad3c2",
         *       "google_id": null,
         *       "facebook_id": null,
         *       "twitter_id": null,
         *       "role": "user",
         *       "created_at": "2015-10-14T08:52:35.317Z",
         *       "updated_at": "2015-10-14T08:52:35.317Z"
         * }
         *
         * @param {number} id - id of user
         * @method getOneUser
         * @instance
         */

        var userId = req.params.id;
        var error;

        if(!userId){
            error = new Error(RESPONSES.NOT_ENOUGH_PARAMETERS);
            error.status = 400;

            return next(error);
        }

        User.findById(userId, function(err, user){
            if(err){
                return next(err);
            }

            res.status(200).send(user);
        });
    };

    this.getUsers = function (req, res, next) {

        /**
         * __Type__ `GET`
         * __Content-Type__ `application/json`
         *
         * This __method__ allows get _all users_
         *
         * @example Request example:
         *         http://192.168.88.250:8787/user
         *
         * @example Response example:
         *
         * [
         *  {
         *    "id": 1,
         *    "first_name": "John",
         *    "last_name": "Smith",
         *    "uuid": "111111-1111-1111-1111-1111111111",
         *    "email": "john@mail.com",
         *    "password": "8d969eef6ecad3c",
         *    "google_id": null,
         *    "facebook_id": null,
         *    "twitter_id": null,
         *    "role": "user",
         *    "created_at": "2015-10-14T08:52:35.317Z",
         *    "updated_at": "2015-10-14T08:52:35.317Z"
         *  },
         *  {
         *    "id": 2,
         *    "first_name": "Jimm",
         *    "last_name": "Smith",
         *    "uuid": "111111-2222-1111-2222-1111111111",
         *    "email": "jimm@mail.com",
         *    "password": "29a3a629280e686cf",
         *    "google_id": null,
         *    "facebook_id": null,
         *    "twitter_id": null,
         *    "role": "user",
         *    "created_at": "2015-10-14T13:00:44.266Z",
         *    "updated_at": "2015-10-14T13:00:44.266Z"
         *  }
         * ]
         *
         * @method getUsers
         * @instance
         */

        var options = {};
        var limit = req.query.limit;
        var page = req.query.page;

        var limitIsValid = limit && !isNaN(limit) && limit > 0;
        var offsetIsValid = page && !isNaN(page) && page > 1;

        options.limit = limitIsValid ? limit : 25;
        options.offset = offsetIsValid ? (page - 1) * options.limit : 0;

        User
            .query(function (qb) {
                qb.limit(options.limit);
                qb.offset(options.offset);
            })
            .fetchAll()
            .asCallback(function(err, users){
                if(err){
                    return next(err);
                }

                res.status(200).send(users);
            });
    };

    /*this.getNewsCount = function (req, res, next) {

        /!**
         * __Type__ `GET`
         * __Content-Type__ `application/json`
         *
         * This __method__ allows get _news count_
         *
         * @example Request example:
         *         http://192.168.88.250:8787/news/count
         *
         * @example Response example:
         *
         *       {
         *          "count": 3
         *      }
         *
         * @method getNewsCount
         * @instance
         *!/

        newsHelper.getNewsCount(function (err, count) {
            if (err) {

                return next(err);
            }

            res.status(200).send({count: count});
        });
    };
*/

    this.userSignUp = function (req, res, next) {

        /**
         * __Type__ `POST`
         * __Content-Type__ `application/json`
         *
         * This __method__ allows _register user_
         *
         * @example Request example:
         *         http://192.168.88.250:8787/user/signUp
         *
         * @example Response example:
         *
         * {
         *     "success": "Was created successfully"
         * }
         *
         * @param {string} first_name - users first name
         * @param {string} last_name - users last name
         * @param {string} email - users email
         * @param {string} password - users password
         * @param {string} google_id - users google_id (optional)
         * @param {string} facebook_id - users facebook_id (optional)
         * @param {string} twitter_id - users twitter_id (optional)
         * @param {string} role - users role
         *
         * @method userSignUp
         * @instance
         */

        var options = req.body;
        var password = options.password;
        var passConfirm = options.pass_confirm;
        var error;

        if (password.length < 6) {
            error = new Error(RESPONSES.PASSWORD_TO_SHORT);
            error.status = 400;

            return next(error);
        }

        if (password !== passConfirm) {
            error = new Error(RESPONSES.PASSWORD_NOT_EQUAL);
            error.status = 400;

            return next(error);
        }

        options.password = cryptoPass.getEncryptedPass(password);

        User.findByEmail(options.email, function(err, user){
            if(err){

                return next(err);
            }

            if(user && user.id){
                error = new Error(RESPONSES.USER_USED_FIELDS.EMAIL);
                error.status = 400;

                return next(error);
            }

            User.createValid(options, function(err, user){
                if(err){

                    return next(err);
                }

                req.logIn(user, function(err) {
                    if(err){

                       return next(err);
                    }

                    //res.redirect('/');

                    res.status(201).send({success: RESPONSES.WAS_CREATED});
                });
            });
        });
    };

    this.updateUser = function (req, res, next){

        /**
         * __Type__ `PUT`
         * __Content-Type__ `application/json`
         *
         * This __method__ allows _update user_
         *
         * @example Request example:
         *         http://192.168.88.250:8787/user/:id
         *
         * @example Response example:
         *
         * {
         *     "success": "Was created successfully",
         *     "user": {
         *          "id": 1,
         *          "first_name": "Johnny",
         *          "last_name": "Smith",
         *          "updated_at": "2015-10-14T14:38:16.831Z"
         *          }
         * }
         *
         * @param {id} id - user id
         * @param {string} first_name - users first name (optional)
         * @param {string} last_name - users last name (optional)
         * @param {string} email - users email (optional)
         * @param {string} password - users password (optional)
         * @param {string} google_id - users google_id (optional)
         * @param {string} facebook_id - users facebook_id (optional)
         * @param {string} twitter_id - users twitter_id (optional)
         * @param {string} role - users role (optional)
         *
         * @method updateUser
         * @instance
         */

        var userId = req.params.id;
        var options = req.body;
        var error;

        if(!userId){
            error = new Error(RESPONSES.NOT_ENOUGH_PARAMETERS);
            error.status = 400;

            return next(error);
        }

        options.id = userId;

        User.updateValid(options, function(err, user){

            if(err){

                return next(err);
            }

            res.status(200).send({
                success: RESPONSES.UPDATED_SUCCESS,
                user: user
            });
        });
    };

    this.removeUser = function (req, res, next){

        /**
         * __Type__ `DELETE`
         * __Content-Type__ `application/json`
         *
         * This __method__ allows _delete user_
         *
         * @example Request example:
         *         http://192.168.88.250:8787/user/:id
         *
         * @example Response example:
         *
         * {
         *   "success": "was removed successfully"
         * }
         *
         * @param {number} id - id of user
         * @method removeUser
         * @instance
         */

        var userId = req.params.id;
        var error;

        if(!userId){
            error = new Error(RESPONSES.NOT_ENOUGH_PARAMETERS);
            error.status = 400;

            return next(error);
        }

        User
            .where({id: userId})
            .destroy()
            .asCallback(function(err){
                if(err){

                    return next(err);
                }

                res.status(200).send({
                    success: RESPONSES.REMOVE_SUCCESSFULY
                });
            });
    };
};

module.exports = Users;

