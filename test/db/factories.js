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
        },
        treatment_id: factory.assoc('treatment', 'id')
    });

    factory.define('region', db.Models[TABLES.REGIONS_LIST], {
        postnummer: function () {
            return '' + randomFrom(9) + randomFrom(9) + randomFrom(9) + randomFrom(9);
        },
        kommunenummer: function () {
            return '' + randomFrom(9) + randomFrom(9) + randomFrom(9) + randomFrom(9);
        },
        poststed: function() {
            return faker.address.city();
        },
        kommunenavn: function() {
            return faker.address.county();
        },
        kategori: 'P',
        fylke: 'Oslo'
    });

    factory.define('hospital', db.Models[TABLES.HOSPITALS], {
        is_paid: function () {
            return !!Math.round(Math.random());
        },
        name: function() {
            return faker.company.companyName(0);
        },
        postcode: function () {
            return '' + randomFrom(9) + randomFrom(9) + randomFrom(9) + randomFrom(9);
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
            return faker.lorem.paragraphs(15);
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

    factory.define('advertisement', db.Models[TABLES.ADVERTISEMENT], {
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

    factory.define('user', db.Models[TABLES.USERS], {
        name: function () {
            return faker.name.firstName() +' '+ faker.name.lastName();
        },
        email: function () {
            return faker.internet.email()
        },
        password: '12356789',
        google_id: function () {
            return faker.random.number()
        },
        facebook_id: function () {
            return faker.random.number()
        },
        twitter_id: function () {
            return faker.random.number()
        },
        role: 'admin'
    });

    return factory;
};

function randomFrom (number) {

    return Math.floor((Math.random() * number));
}
