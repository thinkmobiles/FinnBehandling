var XLSX = require('xlsx');

module.exports = function (knex, cb) {
    var callback = cb || function () {};
    var ws = XLSX.readFile(__dirname + '/files/Postnummerregister_Excel.xlsx');
    var data = toJson(ws, {header: ['postnummer', 'poststed', 'kommunenummer', 'kommunenavn', 'kategori']});

    knex('tb_regions_dic')
        .insert(data)
        .exec(callback);
};

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