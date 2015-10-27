var fylkes = require('./fylkes');
var XLSX = require('xlsx');
var request = require('request');
var async = require('async');

var fylkesNames = Object.keys(fylkes);

function setFylkes (knex, cb) {
    var callback = cb || function () {};

    async.each(fylkesNames, function  (fylkesName, cb) {
        var fylkeKommunes = fylkes[fylkesName];

        knex('tb_regions_dic')
            .whereIn('kommunenavn', fylkeKommunes)
            .update({
                fylke: fylkesName
            })
            .asCallback(cb);
    }, callback);
}

function updateRegions (knex, cb) {
    var callback = cb || function () {};

    getXLSXWithRegions(function (err, req, body) {
        if (err) {
            callback(err);
        }

        var ws = XLSX.read(body);
        var data = toJson(ws, {header: ['postnummer', 'poststed', 'kommunenummer', 'kommunenavn', 'kategori']});

        dropRegionsTable(knex, function  (err) {
            if (err) {
                callback(err);
            }

            knex('tb_regions_dic')
                .insert(data)
                .asCallback(callback);
        });
    });
}

function toJson(workbook, options) {
    var result = [];

    workbook.SheetNames.forEach(function(sheetName) {
        var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], options);
        if (roa.length) {
            roa.shift();
            result = roa;
        }
    });

    return result;
}

function getXLSXWithRegions (cb) {
    var callback = cb || function () {};

    request({
        url: 'http://www.bring.no/radgivning/sende-noe/adressetjenester/postnummer/_attachment/615732',
        encoding: null
    }, callback);
}

function dropRegionsTable (knex, cb) {
    var callback = cb || function () {};

    knex('tb_regions_dic')
        .del()
        .asCallback(callback);
}

module.exports = {
    setFylkes: setFylkes,
    updateRegions: updateRegions
};