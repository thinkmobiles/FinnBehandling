module.exports = {
    // DICTIONARIES

    REGIONS_DIC: 'CREATE TABLE IF NOT EXISTS tb_regions_dic ( ' +
                    'id serial NOT NULL, ' +
                    'zip_code varchar(35), ' +
                    'kommune_name varchar(50), ' +
                    'fylke_name varchar(50), ' +
                    'CONSTRAINT tb_regions_dic_pkey PRIMARY KEY (id)' +
                    ') WITHOUT OIDS; ',
    HOSPITAL_TYPES_DIC: 'CREATE TABLE IF NOT EXISTS tb_hospital_types_dic ( ' +
                        'id serial NOT NULL, ' +
                        'name varchar(80), ' +
                        'CONSTRAINT tb_hospital_types_dic_pkey PRIMARY KEY (id)' +
                        ') WITHOUT OIDS; ',
    TREATMENTS_DIC: 'CREATE TABLE IF NOT EXISTS tb_treatments_dic ( ' +
                    'id serial NOT NULL, ' +
                    'name varchar(30) NOT NULL, ' +
                    'CONSTRAINT tb_treatments_dic_pkey PRIMARY KEY (id)' +
                    ') WITHOUT OIDS;',
    SUB_TREATMENTS_DIC: 'CREATE TABLE IF NOT EXISTS tb_sub_treatments_dic ( ' +
                        'id serial NOT NULL, ' +
                        'name varchar(30) NOT NULL, ' +
                        'CONSTRAINT tb_sub_treatments_dic_pkey PRIMARY KEY (id)' +
                        ') WITHOUT OIDS;',

    //OTHER TABLES

    USERS: 'CREATE TABLE IF NOT EXISTS tb_users ( ' +
                    'id serial NOT NULL, ' +
                    'first_name varchar(25) NOT NULL, ' +
                    'last_name varchar(25) NOT NULL, ' +
                    'uuid uuid DEFAULT uuid_generate_v4(), ' +
                    'email varchar(35), ' +
                    'password varchar(255) NOT NULL, ' +
                    'google_id varchar(50), ' +
                    'facebook_id varchar(50), ' +
                    'twitter_id varchar(50), ' +
                    'role varchar(15) NOT NULL, ' +
                    'CONSTRAINT tb_users_pkey PRIMARY KEY (id)' +
                    ') WITHOUT OIDS; ',
    NEWS: 'CREATE TABLE IF NOT EXISTS tb_news ( ' +
                        'id serial NOT NULL, ' +
                        'subject varchar(80), ' +
                        'content text, ' +
                        'source varchar(50), ' +
                        'CONSTRAINT tb_news_pkey PRIMARY KEY (id)' +
                        ') WITHOUT OIDS; ',
    IMAGES: 'CREATE TABLE tb_images ( ' +
            'id serial NOT NULL, ' +
            'name varchar(150), ' +
            'imageable_type varchar(150), ' +
            'imageable_field varchar(50), ' +
            'imageable_id integer, ' +
            'CONSTRAINT tb_images_pkey PRIMARY KEY (id) ' +
            ') WITHOUT OIDS;',

    HOSPITAL: 'CREATE TABLE IF NOT EXISTS tb_hospitals ( ' +
                    'id serial NOT NULL, ' +
                    'region_id integer NOT NULL, ' +
                    'is_paid boolean NOT NULL, ' +
                    'type_id integer NOT NULL, ' +
                    'name varchar(80), ' +
                    'position text, ' +
                    'CONSTRAINT tb_hospitals_pkey PRIMARY KEY (id), ' +
                    'CONSTRAINT tb_hospitals_region_id_foreign FOREIGN KEY (region_id) REFERENCES tb_regions_dic (id) MATCH SIMPLE ' +
                    'ON UPDATE CASCADE ON DELETE CASCADE, ' +
                    'CONSTRAINT tb_hospitals_type_id_foreign FOREIGN KEY (type_id) REFERENCES tb_hospital_types_dic (id) MATCH SIMPLE ' +
                    'ON UPDATE CASCADE ON DELETE CASCADE ' +
                    ') WITHOUT OIDS; ',
    HOSPITAL_TREATMENTS: 'CREATE TABLE tb_hospital_treatments ( ' +
                                'id serial NOT NULL, ' +
                                'hospital_id integer NOT NULL, ' +
                                'treatment_id integer NOT NULL, ' +
                                'CONSTRAINT tb_hospital_treatments_pkey PRIMARY KEY (id), ' +
                                'CONSTRAINT tb_hospital_treatments_hospital_id_foreign FOREIGN KEY (hospital_id) REFERENCES tb_hospitals (id) MATCH SIMPLE ' +
                                'ON UPDATE CASCADE ON DELETE CASCADE, ' +
                                'CONSTRAINT tb_hospital_treatments_treatment_id_foreign FOREIGN KEY (treatment_id) REFERENCES tb_treatments_dic (id) MATCH SIMPLE ' +
                                'ON UPDATE CASCADE ON DELETE CASCADE ' +
                                ') WITHOUT OIDS;',
    HOSPITAL_SUB_TREATMENTS: 'CREATE TABLE tb_hospital_sub_treatments ( ' +
                                'id serial NOT NULL, ' +
                                'treatment_id integer NOT NULL, ' +
                                'sub_treatment_id integer NOT NULL, ' +
                                'CONSTRAINT tb_hospital_sub_treatments_pkey PRIMARY KEY (id),' +
                                'CONSTRAINT tb_hospital_sub_treatments_treatment_id_foreign FOREIGN KEY (treatment_id) REFERENCES tb_hospital_treatments (id) MATCH SIMPLE ' +
                                'ON UPDATE CASCADE ON DELETE CASCADE, ' +
                                'CONSTRAINT tb_hospital_sub_treatments_sub_treatment_id_foreign FOREIGN KEY (sub_treatment_id) REFERENCES tb_sub_treatments_dic (id) MATCH SIMPLE ' +
                                'ON UPDATE CASCADE ON DELETE CASCADE ' +
                                ') WITHOUT OIDS;',
    HOSPITAL_TEXTS: 'CREATE TABLE IF NOT EXISTS tb_hospital_texts ( ' +
                    'id serial NOT NULL, ' +
                    'hospital_id integer NOT NULL, ' +
                    'type varchar(35) NOT NULL, ' +
                    'content text, ' +
                    'CONSTRAINT tb_hospital_texts_pkey PRIMARY KEY (id), ' +
                    'CONSTRAINT tb_hospital_texts_hospital_id_foreign FOREIGN KEY (hospital_id) REFERENCES tb_hospitals (id) MATCH SIMPLE ' +
                    'ON UPDATE CASCADE ON DELETE CASCADE ' +
                    ') WITHOUT OIDS;'

};