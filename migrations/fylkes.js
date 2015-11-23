var async = require('async');

var Oslo = ['OSLO'];

var Østfold = ['AREMARK', 'ASKIM', 'EIDSBERG', 'FREDRIKSTAD', 'HALDEN', 'HOBØL', 'HVALER', 'MARKER', 'MOSS',
    'RAKKESTAD', 'RYGGE', 'RØMSKOG', 'RÅDE', 'SARPSBORG', 'SKIPTVET', 'SPYDEBERG', 'TRØGSTAD', 'VÅLER'];

var Akershus = ['ASKER', 'AURSKOG-HØLAND', 'BÆRUM', 'EIDSVOLL', 'ENEBAKK', 'FET', 'FROGN', 'GJERDRUM', 'HURDAL',
    'LØRENSKOG', 'NANNESTAD', 'NES', 'NESODDEN', 'NITTEDAL', 'OPPEGÅRD', 'RÆLINGEN', 'SKEDSMO', 'SKI', 'SØRUM',
    'ULLENSAKER', 'VESTBY', 'ÅS'];

var Hedmark = ['RINGSAKER', 'HAMAR', 'ELVERUM', 'STANGE', 'KONGSVINGER', 'SØR-ODAL', 'ÅSNES', 'LØTEN', 'TRYSIL',
    'EIDSKOG', 'TYNSET', 'NORD-ODAL', 'GRUE', 'ÅMOT', 'VÅLER', 'STOR-ELVDAL', 'ALVDAL', 'OS (HEDMARK)', 'RENDALEN',
    'TOLGA', 'FOLLDAL', 'ENGERDAL'];

var Oppland = ['DOVRE', 'ETNEDAL', 'GAUSDAL', 'GJØVIK', 'GRAN', 'JEVNAKER', 'LESJA', 'LILLEHAMMER', 'LOM', 'LUNNER',
    'NORD-AURDAL', 'NORD-FRON', 'NORDRE LAND', 'ØSTRE TOTEN', 'ØYER', 'ØYSTRE SLIDRE', 'RINGEBU', 'SEL', 'SKJÅK',
    'SØNDRE LAND', 'SØR-AURDAL', 'SØR-FRON', 'VÅGÅ', 'VANG', 'VESTRE SLIDRE', 'VESTRE TOTEN'];

var Buskerud = ['DRAMMEN', 'RINGERIKE', 'KONGSBERG', 'LIER', 'NEDRE EIKER', 'RØYKEN', 'ØVRE EIKER', 'MODUM', 'HURUM',
    'HOLE', 'ÅL', 'GOL', 'HOL', 'SIGDAL', 'NES', 'FLESBERG', 'NORE OG UVDAL', 'KRØDSHERAD', 'HEMSEDAL', 'ROLLAG', 'FLÅ'];

var Vestfold = ['ANDEBU', 'HOF', 'HOLMESTRAND', 'HORTEN', 'LARDAL', 'LARVIK', 'NØTTERØY', 'RE', 'SANDE (V.)',
    'SANDEFJORD', 'STOKKE', 'SVELVIK', 'TJØME', 'TØNSBERG'];

var Telemark = ['SKIEN', 'PORSGRUNN', 'BAMBLE', 'NOTODDEN', 'KRAGERØ', 'NOME', 'TINN', 'BØ (TEL.)', 'SAUHERAD',
    'DRANGEDAL', 'VINJE', 'SELJORD', 'KVITESEID', 'SILJAN', 'TOKKE', 'HJARTDAL', 'NISSEDAL', 'FYRESDAL'];

var AustAgder = ['ARENDAL', 'GRIMSTAD', 'LILLESAND', 'RISØR', 'TVEDESTRAND', 'FROLAND', 'BIRKENES', 'EVJE OG HORNNES',
    'GJERSTAD', 'VEGÅRSHEI', 'ÅMLI', 'VALLE', 'IVELAND', 'BYGLAND', 'BYKLE'];

var VestAgder = ['KRISTIANSAND', 'MANDAL', 'VENNESLA', 'SØGNE', 'FARSUND', 'FLEKKEFJORD', 'LYNGDAL', 'SONGDALEN',
    'KVINESDAL', 'LINDESNES', 'MARNARDAL', 'SIRDAL', 'AUDNEDAL', 'HÆGEBOSTAD', 'ÅSERAL'];

var Rogaland = ['BJERKREIM', 'BOKN', 'IGERSUND', 'FINNØY', 'FINNØY', 'GJESDAL', 'HÅ', 'HAUGESUND', 'HJELMELAND',
    'KARMØY', 'KLEPP', 'KVITSØY', 'LUND', 'RANDABERG', 'RENNESØY', 'SANDNES', 'SAUDA', 'SOKNDAL', 'SOLA', 'STAVANGER',
    'STRAND', 'SULDAL', 'TIME', 'TYSVÆR', 'UTSIRA', 'VINDAFJORD', 'FORSAND', 'EIGERSUND'];

var Hordaland = ['ASKØY', 'AUSTEVOLL', 'AUSTRHEIM', 'BERGEN', 'BØMLO', 'EIDFJORD', 'ETNE', 'FEDJE', 'FITJAR', 'FJELL',
    'FUSA', 'GRANVIN', 'JONDAL', 'KVAM', 'KVINNHERAD', 'LINDÅS', 'MASFJORDEN', 'MELAND', 'MODALEN', 'OS (HORDALAND)',
    'OSTERØY', 'RADØY', 'SAMNANGER', 'STORD', 'SUND', 'SVEIO', 'TYSNES', 'ULLENSVANG', 'ULVIK', 'VAKSDAL', 'VOSS',
    'ØYGARDEN', 'ODDA'];

var SognOgFjordane = ['FLORA', 'GULEN', 'SOLUND', 'HYLLESTAD', 'HØYANGER', 'VIK', 'BALESTRAND', 'LEIKANGER', 'SOGNDAL',
    'AURLAND', 'LÆRDAL', 'ÅRDAL', 'LUSTER', 'ASKVOLL', 'FJALER', 'GAULAR', 'JØLSTER', 'FØRDE', 'NAUSTDAL', 'BREMANGER',
    'VÅGSØY', 'SELJE', 'EID', 'HORNINDAL', 'GLOPPEN', 'STRYN'];

var MøreOgRomsdal = ['MOLDE', 'ÅLESUND', 'KRISTIANSUND', 'VANYLVEN', 'SANDE (M.R.)', 'HERØY (M.R.)', 'ULSTEIN', 'HAREID',
    'VOLDA', 'ØRSTA', 'ØRSKOG', 'NORDDAL', 'STRANDA', 'STORDAL', 'SYKKYLVEN', 'SKODJE', 'SULA', 'GISKE', 'HARAM',
    'VESTNES', 'RAUMA', 'NESSET', 'MIDSUND', 'SANDØY', 'AUKRA', 'FRÆNA', 'EIDE', 'AVERØY', 'GJEMNES', 'TINGVOLL',
    'SUNNDAL', 'SURNADAL', 'RINDAL', 'HALSA', 'SMØLA', 'AURE'];

var SørTrøndelag = ['TRONDHEIM', 'MELHUS', 'MALVIK', 'ORKDAL', 'SKAUN', 'OPPDAL', 'RISSA', 'MIDTRE GAULDAL', 'KLÆBU',
    'RØROS', 'ØRLAND', 'BJUGN', 'FRØYA', 'HITRA', 'HEMNE', 'SELBU', 'MELDAL', 'ÅFJORD', 'RENNEBU', 'HOLTÅLEN',
    'AGDENES', 'OSEN', 'ROAN', 'SNILLFJORD', 'TYDAL'];

var NordTrøndelag = ['FLATANGER', 'FOSNES', 'FROSTA', 'GRONG', 'HØYLANDET', 'INDERØY', 'LEKA', 'LEKSVIK', 'LEVANGER',
    'LIERNE', 'MERÅKER', 'NÆRØY', 'NAMDALSEID', 'NAMSOS', 'NAMSSKOGAN', 'OVERHALLA', 'RØYRVIK', 'SNÅSA', 'STEINKJER',
    'STJØRDAL', 'VERDAL', 'VERRAN', 'VIKNA'];

var Nordland = ['ALSTAHAUG', 'ANDØY', 'BALLANGEN', 'BEIARN', 'BINDAL', 'BØ (N.)', 'BODØ', 'BRØNNØY', 'DØNNA', 'EVENES',
    'FAUSKE', 'FLAKSTAD', 'GILDESKÅL', 'GRANE', 'HADSEL', 'HAMARØY', 'HATTFJELLDAL', 'HEMNES', 'HERØY (N.)', 'LEIRFJORD',
    'LØDINGEN', 'LURØY', 'MELØY', 'MOSKENES', 'NARVIK', 'NESNA', 'ØKSNES', 'RANA', 'RØDØY', 'RØST', 'SALTDAL', 'SØMNA',
    'SØRFOLD', 'SORTLAND', 'STEIGEN', 'TJELDSUND', 'TRÆNA', 'TYSFJORD', 'VÆRØY', 'VÅGAN', 'VEFSN', 'VEGA', 'VESTVÅGØY',
    'VEVELSTAD', 'JAN MAYEN'];

var Troms = ['BALSFJORD', 'BARDU', 'BERG', 'HARSTAD', 'DYRØY', 'GRATANGEN', 'HARSTAD', 'IBESTAD', 'GÁIVUOTNA KÅFJORD',
    'KARLSØY', 'KVÆFJORD', 'KVÆNANGEN', 'LAVANGEN', 'LENVIK', 'LYNGEN', 'MÅLSELV', 'NORDREISA', 'SALANGEN', 'SKÅNLAND',
    'SKJERVØY', 'SØRREISA', 'STORFJORD', 'TORSKEN', 'TRANØY', 'TROMSØ'];

var Finnmark = ['ALTA', 'BERLEVÅG', 'BÅTSFJORD', 'GAMVIK', 'HAMMERFEST', 'HASVIK', 'KARASJOHKA KARASJOK',
    'GUOVDAGEAIDNU KAUTOKEINO', 'KVALSUND', 'LEBESBY', 'LOPPA', 'MÅSØY', 'UNJARGGA NESSEBY', 'NORDKAPP',
    'PORSANGER PORSÁNGU PORSANKI', 'SØR-VARANGER', 'DEATNU TANA', 'VADSØ', 'VARDØ'];

module.exports = function (knex, cb) {
    var callback = cb || function () {};

    async.series([
        function UpdateOslo (cb) {
            knex('tb_regions_dic')
                .whereIn('kommunenavn', Oslo)
                .update({
                    fylke: 'Oslo'
                })
                .exec(cb);
        },
        function UpdateØstfold (cb) {
            knex('tb_regions_dic')
                .whereIn('kommunenavn', Østfold)
                .update({
                    fylke: 'Østfold'
                })
                .exec(cb);
        },
        function UpdateAkershus (cb) {
            knex('tb_regions_dic')
                .whereIn('kommunenavn', Akershus)
                .update({
                    fylke: 'Akershus'
                })
                .exec(cb);
        },
        function UpdateHedmark (cb) {
            knex('tb_regions_dic')
                .whereIn('kommunenavn', Hedmark)
                .update({
                    fylke: 'Hedmark'
                })
                .exec(cb);
        },
        function UpdateOppland (cb) {
            knex('tb_regions_dic')
                .whereIn('kommunenavn', Oppland)
                .update({
                    fylke: 'Oppland'
                })
                .exec(cb);
        },
        function UpdateBuskerud (cb) {
            knex('tb_regions_dic')
                .whereIn('kommunenavn', Buskerud)
                .update({
                    fylke: 'Buskerud'
                })
                .exec(cb);
        },
        function UpdateVestfold (cb) {
            knex('tb_regions_dic')
                .whereIn('kommunenavn', Vestfold)
                .update({
                    fylke: 'Vestfold'
                })
                .exec(cb);
        },
        function UpdateTelemark (cb) {
            knex('tb_regions_dic')
                .whereIn('kommunenavn', Telemark)
                .update({
                    fylke: 'Telemark'
                })
                .exec(cb);
        },
        function UpdateTelemark (cb) {
            knex('tb_regions_dic')
                .whereIn('kommunenavn', AustAgder)
                .update({
                    fylke: 'Aust-Agder'
                })
                .exec(cb);
        },
        function UpdateTelemark (cb) {
            knex('tb_regions_dic')
                .whereIn('kommunenavn', VestAgder)
                .update({
                    fylke: 'Vest-Agder'
                })
                .exec(cb);
        },
        function UpdateTelemark (cb) {
            knex('tb_regions_dic')
                .whereIn('kommunenavn', Rogaland)
                .update({
                    fylke: 'Rogaland'
                })
                .exec(cb);
        },
        function UpdateTelemark (cb) {
            knex('tb_regions_dic')
                .whereIn('kommunenavn', Hordaland)
                .update({
                    fylke: 'Hordaland'
                })
                .exec(cb);
        },
        function UpdateTelemark (cb) {
            knex('tb_regions_dic')
                .whereIn('kommunenavn', SognOgFjordane)
                .update({
                    fylke: 'Sogn og Fjordane'
                })
                .exec(cb);
        },
        function UpdateTelemark (cb) {
            knex('tb_regions_dic')
                .whereIn('kommunenavn', MøreOgRomsdal)
                .update({
                    fylke: 'Møre og Romsdal'
                })
                .exec(cb);
        },
        function UpdateTelemark (cb) {
            knex('tb_regions_dic')
                .whereIn('kommunenavn', SørTrøndelag)
                .update({
                    fylke: 'Sør-Trøndelag'
                })
                .exec(cb);
        },
        function UpdateTelemark (cb) {
            knex('tb_regions_dic')
                .whereIn('kommunenavn', NordTrøndelag)
                .update({
                    fylke: 'Nord-Trøndelag'
                })
                .exec(cb);
        },
        function UpdateTelemark (cb) {
            knex('tb_regions_dic')
                .whereIn('kommunenavn', Nordland)
                .update({
                    fylke: 'Nordland'
                })
                .exec(cb);
        },
        function UpdateTelemark (cb) {
            knex('tb_regions_dic')
                .whereIn('kommunenavn', Troms)
                .update({
                    fylke: 'Troms'
                })
                .exec(cb);
        },
        function UpdateTelemark (cb) {
            knex('tb_regions_dic')
                .whereIn('kommunenavn', Finnmark)
                .update({
                    fylke: 'Finnmark'
                })
                .exec(cb);
        }
    ], callback);
};