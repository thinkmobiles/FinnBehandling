'use strict';
var async = require('async');

module.exports.setUp = function (db, callback) {
    var factory = require('./factories')(db);
    var fixtures;

    function createInstance () {
        fixtures = {
            trainerUser: {},
            clients: [],
            memberships: [],
            sessions: [],
            subscriptions: [],
            workouts: [],
            exercises: [],
            sets: [],
            requests: [],
            trainers: [],
            trainers_subscriptions: [],
            groups: []
        };

        // some functions to create fake data

    }

    if (callback && typeof callback === 'function') {
        callback();
    }

    return (function () {
        if (!fixtures) {
            fixtures = createInstance();
        }

        return fixtures;
    })();
};