var factoryGirl = require('factory-girl');
var factory = new factoryGirl.Factory();
var faker = require('faker');
var BookshelfAdapter = require('factory-girl-bookshelf')();
factory.setAdapter(BookshelfAdapter);

module.exports = function (db) {
    /*factory.define('user', db.Models.User, {
        username: function() {
            return faker.internet.userName();
        },
        email: function() {
            return 'some' + emailCounter++ + '@mail.net';
        },
        pass: defaultPassword,
        facebook_id: function() {
            return facebookIdCounter++;
        },
        device_id: '',
        profile_id: null,
        subscription_expired: false
    });*/

    return factory;
};