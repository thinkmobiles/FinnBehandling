var express = require('express');
var path = require('path');
var cons = require('consolidate');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var http = require('http');
var port;
var server;
var config;
var session = require('express-session');
var MemoryStore = require('connect-redis')(session);
var fs = require( 'fs' );
var knex;
var PostGre;
var Models;
var Migrator;
var migrator;
var getPassport = require('./helpers/passport');
var passport;


app.use( function ( req, res, next ) {

    res.on('finish', function () {

        if (req.files) {

            Object.keys(req.files).forEach( function (file) {

                console.log(req.files[file].path);

                fs.unlink(req.files[file].path, function (err) {

                    if (err) {
                        console.log(err);
                    }
                });
            });
        }
    });

    next();
});

app.engine('html', cons.swig);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(logger('dev'));
app.use(bodyParser.json({strict: false, inflate: false, limit: 1024 * 1024 * 200}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


/*if (app.get('env') === 'development') {
    require('./config/development');

} else if (app.get('env') === 'test') {*/
    require('./config/test');


//require('./config/development');

config = {
    db: process.env.REDIS_DB_KEY,
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT) || 6379
};

app.use(session({
    name: 'testCall',
    secret: '1q2w3e4r5tdhgkdfhgejflkejgkdlgh8j0jge4547hh',
    resave: true,
    saveUninitialized: true,
    store: new MemoryStore(config)
}));

knex = require('knex')({
    debug: true,
    client: 'pg',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME
        //charset: 'utf8'
    }
});

PostGre = require('bookshelf')(knex);

Models = require('./models/index');
var Collections = require('./collections/index');



PostGre.Models = new Models(PostGre);
PostGre.Collections = new Collections(PostGre);

passport = getPassport(PostGre);

app.use(passport.initialize());
app.use(passport.session());

app.set('PostGre', PostGre);

var uploaderConfig = {
    type: process.env.UPLOADING_TYPE,
    directory: 'public'
    /*awsConfig: {
        accessKeyId: process.env.AMAZON_ACCESS_KEY_ID,
        secretAccessKey: process.env.AMAZON_SECRET_ACCESS_KEY,
        imageUrlDurationSec: 60 * 60 * 24 * 365 * 10
    }*/
};

require('./routes/index')(app, PostGre);

port = parseInt(process.env.PORT) || 8823;
server = http.createServer(app);

server.listen(port, function () {
    console.log('Express start on port ' + port);
});

module.exports = app;