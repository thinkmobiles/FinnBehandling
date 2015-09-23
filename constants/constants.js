/**
 * Created by Roman on 26.02.2015.
 */
module.exports = {
    DEFAULT_CID: 123456,
    DEFAULT_TABLE: "members",

    FEES_SENIOR: 70,
    FEES_NEW_MEMBER_PACK: 115,
    FEES_JUNIOR: 50,
    FEES_JUNIOR_NEW_MEMBER_PACK: 95,
    FEES_FAMILY: 140,
    FEES_ASSOCIATE: 15,
    FEES_DESCRIPTION: 'Registration Fees',
    CURRENCY: 'USD',

    FEES: {
        SENIOR: {
            UID: 1,
            PRICE: 70,
            DESCRIPTION: 'Senior Registration Fees',
            MEMBERSHIP_TYPE_ID: 0
        },
        JUNIOR: {
            UID: 2,
            PRICE: 50,
            DESCRIPTION: 'Junior Registration Fees',
            MEMBERSHIP_TYPE_ID: 0
        },
        FAMILY: {
            UID: 3,
            PRICE: 140,
            DESCRIPTION: 'Family Registration Fees (2 adults + all children)',
            MEMBERSHIP_TYPE_ID: 0
        },
        ASSOCIATE: {
            UID: 4,
            PRICE: 15,
            DESCRIPTION: 'Associate Registration Fees',
            MEMBERSHIP_TYPE_ID: 1
        }
    },

    ORDER_STATUS: {
        PAID: 1,
        UNPAID: 0
    },

    KITS_TYPE: {
        MEN: 3,
        LADIES: 2,
        JUNIOR: 1,
        ALL: 0
    },

    MENS_TYPE: 3,
    LADIES_TYPE: 2,
    JUNIOR_TYPE: 1,
    ALL_TYPE: 0,

    USER_TYPE: {
        ADMIN: 0,
        USER: 1
    },

    GENDER: {
        MALE: 0,
        FEMALE: 1
    },

    MEMBER_STATUS: {
        ACTIVE: 0,
        INACTIVE: 1,
        ARCHIVE: 2
    },

    MEMBERSHIP_TYPE: {
        FULL: 0,
        ASSOCIATE: 1,
        GUEST: 2
    },

    FULL_MEMBERSHIP_TYPE: {
        DEFAULT: 0,
        ANSW: 1,
        COMMITTEE: 2
    },

    FAMILY_LIMITS: {
        SENIOR_MIN_COUNT: 2,
        SENIOR_MAX_COUNT: 2,

        JUNIOR_MIN_COUNT: 1,
        JUNIOR_MAX_COUNT: 10
    },
    REGULAR_EXPRESSIONS: {
        FAMILY_ID: /F$/,
        FAMILY_FORGOT_TOKEN: /family/
    },
    SESSION_TYPES: {
        MEMBER: 0,
        FAMILY: 1
    },
    SESSION_JOB_TYPES: {
        CREATE: 0,
        RENEW: 1
    },
    SERIE_TYPE: {
        TRACK: 0,
        WINTER: 1,
        SUMMER: 2
    },
    SERIE_NAME: {
        TRACK: 'Track',
        WINTER: 'Winter',
        SUMMER: 'Summer'
    },

    MAILER_DEFAULT_FROM: 'Kembla Joggers',
    MAILER_DEFAULT_EMAIL_ADDRESS: 'runners@kemblajoggers.club'
};