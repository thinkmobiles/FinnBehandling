var express = require('express');
var regionsRouter = express.Router();

module.exports = function (PostGre) {

    regionsRouter.get('/', function (req, res) {
        if (!req.session || !req.session.passport || !req.session.passport.user) {
            return res.status(301).redirect('/admin/signIn');
        }

        res.sendfile('views/admin.html');
    });

    regionsRouter.get('/signIn', function (req, res) {
        if (req.session && req.session.passport && req.session.passport.user) {
            return res.status(301).redirect('/admin');
        }

        res.render('login', {title: 'Sign In'});
    });

    return regionsRouter;
};