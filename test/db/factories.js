var factoryGirl = require('factory-girl');
var factory = new factoryGirl.Factory();
var faker = require('faker');
var BookshelfAdapter = require('factory-girl-bookshelf')();
var TABLES = require('../../constants/tables');
factory.setAdapter(BookshelfAdapter);

module.exports = function (db) {

    factory.define('treatment', db.Models[TABLES.TREATMENTS_LIST], {
        name: function() {
            return faker.lorem.sentence(1, 0);
        }
    });

    factory.define('sub_treatment', db.Models[TABLES.SUB_TREATMENTS_LIST], {
        name: function() {
            return faker.lorem.sentence(1, 0);
        }
    });

    factory.define('region', db.Models[TABLES.REGIONS_LIST], {
        zip_code: function() {
            return faker.address.zipCode();
        },
        kommune_name: function() {
            return faker.address.county();
        },
        fylke_name: function() {
            return faker.address.country();
        }
    });

    factory.define('hospital_type', db.Models[TABLES.HOSPITAL_TYPES_LIST], {
        name: function() {
            return faker.lorem.sentence(1, 0);
        }
    });

    factory.define('hospital', db.Models[TABLES.HOSPITALS], {
        region_id: factory.assoc('region', 'id'),
        is_paid: function () {
            return !!Math.round(Math.random());
        },
        type_id: factory.assoc('hospital_type', 'id'),
        name: function() {
            return faker.company.companyName(0);
        },
        web_address: 'shouldntbethere.com',
        phone_number: function () {
            return [
                faker.phone.phoneNumber("+47########"),
                faker.phone.phoneNumber("+47########"),
                faker.phone.phoneNumber("+47########")
            ];
        },
        email: function () {
            return [
                faker.internet.email(),
                faker.internet.email(),
                faker.internet.email()
            ];
        },
        position: function () {
            return '('+ faker.address.latitude() +','+ faker.address.longitude() +')';
        },
        description: function () {
            return faker.lorem.paragraph();
        },
        address: function () {
            return faker.address.streetAddress();
        }

    });

    factory.define('news_article', db.Models[TABLES.NEWS], {
        subject: function() {
            return faker.lorem.sentence(1, 0);
        },
        content: function() {
            return faker.lorem.paragraph();
        },
        source: function() {
            return faker.lorem.sentence(1, 3);
        }
    });

    factory.define('static_data', db.Models[TABLES.STATIC_DATA], {
        id: 1,
        text: function() {
            return faker.lorem.sentence(10, 0);
        }
    });

    factory.define('image', db.Models[TABLES.IMAGES], {
        name: 'default_name',
        imageable_id: 1,
        imageable_type: 'default_type',
        imageable_field: 'default_field'
    });

    return factory;
};