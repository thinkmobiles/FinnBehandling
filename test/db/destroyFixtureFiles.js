var TABLES = require('../../constants/tables');
var fs = require('fs');
var path = require('path');

module.exports = function (callback) {

    var dir = path.join(__dirname, '..', 'uploads', 'images');

    if( fs.existsSync(dir) ) {
        fs.readdirSync(dir).forEach(function(file, index){
            var curPath = path.join(dir, file);

            fs.unlinkSync(curPath);
        });
    }

    console.log('==============================================');
    console.log('Fixtures have dropped');
    console.log('==============================================');

    callback();
};