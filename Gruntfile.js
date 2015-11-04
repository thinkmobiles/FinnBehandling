module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-concat-css');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-jsdoc');

    grunt.initConfig({
        watch: {
            app: {
                files: [
                    'Gruntfile.js',
                    'public/js/modules/**/*.js',
                    'public/css/*.css',
                    'public/less/**/*.less',
                    'public/less/*.less'
                ],
                tasks: [
                    'less:app',
                    'concat_css:app',
                    'jshint:app',
                    'concat:app'
                ],
                options: {
                    spawn: false
                }
            },
            admin: {
                files: [
                    'Gruntfile.js',
                    'public/js/admin/**/*.js',
                    'public/css/*.css',
                    'public/less/**/*.less',
                    'public/less/*.less'
                ],
                tasks: [
                    'less:app',
                    'concat_css:app',
                    'jshint:admin',
                    'concat:admin'
                ],
                options: {
                    spawn: false
                }
            }
        },

        jshint: {
            app: [
                'Gruntfile.js',
                'public/js/modules/controllers/*.js',
                'public/js/modules/services/*.js'
            ],
            admin: [
                'Gruntfile.js',
                'public/js/admin/controllers/*.js',
                'public/js/admin/services/*.js'
            ]
        },

        clean: {
            app: ['./public/dist/temp/css/*.css']
        },

        concat: {
            options: {
                separator: ';\n'
            },
            app: {
                src: [
                    'public/js/libs/angular/angular.js',
                    'public/js/libs/angular-resource/angular-resource.js',
                    'public/js/libs/angular-route/angular-route.js',
                    'public/js/libs/angular-animate/angular-animate.js',
                    'public/js/libs/angular-strap/dist/angular-strap.js',
                    'public/js/libs/angular-strap/dist/angular-strap.tpl.js',
                    'public/js/libs/angularUtils-pagination/dirPagination.js',
                    'public/js/modules/config.js',
                    'public/js/modules/app.js',
                    'public/js/modules/routes.js',
                    'public/js/modules/**/*.js'
                ],
                dest: 'public/dist/js/app.js'
            },
            admin: {
                src: [
                    'public/js/libs/exif.js',
                    'public/js/libs/binaryajax/src/binaryajax.js',
                    'public/js/libs/hammerjs/hammer.js',

                    'public/js/libs/jquery/dist/jquery.js',
                    'public/js/libs/jquery.mousewheel/jquery.mousewheel.js',
                    'public/js/libs/jquery-ui/jquery-ui.js',

                    'public/js/libs/angular/angular.js',
                    'public/js/libs/angular-resource/angular-resource.js',
                    'public/js/libs/angular-route/angular-route.js',
                    'public/js/libs/angular-animate/angular-animate.js',

                    'public/js/libs/angular-strap/dist/angular-strap.js',
                    'public/js/libs/angular-strap/dist/angular-strap.tpl.js',

                    'public/js/libs/angularUtils-pagination/dirPagination.js',

                    'public/js/libs/textAngular/dist/textAngular-rangy.min.js',
                    'public/js/libs/textAngular/dist/textAngular-sanitize.js',
                    'public/js/libs/textAngular/dist/textAngular.js',
                    'public/js/libs/textAngular/dist/textAngularSetup.js',
                    'public/js/libs/jquery.cropbox.js',

                    'public/js/admin/config.js',
                    'public/js/admin/app.js',
                    'public/js/admin/routes.js',
                    'public/js/admin/**/*.js'
                ],
                dest: 'public/dist/js/admin.js'
            }
        },

        uglify: {
            app: {
                files: {
                    'public/dist/app.min.js': ['public/dist/js/app.js']
                },
                options: {
                    mangle: false
                }
            },
            admin: {
                files: {
                    'public/dist/app.min.js': ['public/dist/js/admin.js']
                },
                options: {
                    mangle: false
                }
            }
        },

        less: {
            app: {
                options: {
                    compress: true,
                    yuicompress: true,
                    optimization: 2
                },
                files: {
                    "public/dist/temp/css/main.less.css": "public/less/style.less"
                }
            }
        },

        concat_css: {
            app: {
                src: [
                    "public/css/*.css",
                    "public/dist/temp/css/*.css"
                ],
                dest: "./public/dist/css/style.css"
            },
            admin: {
                src: [
                    "public/css/*.css",
                    "public/dist/temp/css/*.css",
                    "public/js/libs/textAngular/dist/textAngular.css"
                ],
                dest: "./public/dist/css/admin_style.css"
            }
        },

        cssmin: {
            app: {
                files: [{
                    expand: true,
                    cwd: './public/dist/css',
                    src: ['style.css'],
                    dest: './public/dist/css',
                    ext: '.min.css'
                }]
            }
        },

        jsdoc : {
            dist : {
                src: ['handlers/**/*.js'],
                options: {
                    destination: 'doc',
                    template : "node_modules/grunt-jsdoc/node_modules/ink-docstrap/template",
                    configure : "jsdoc.json"
                }
            }
        }
    });

    grunt.registerTask('default', ['jsdoc']);

    grunt.registerTask('dev', [
        'jshint:app',
        'less:app',
        'concat:app',
        'concat_css:app',
        'watch:app'
    ]);

    grunt.registerTask('prod', [
        'jshint:app',
        'less:app',
        'concat:app',
        'uglify:app',
        'clean:app',
        'concat_css:app',
        'cssmin:app',
        'watch:app'
    ]);

    grunt.registerTask('admin_dev', [
        'jshint:admin',
        'less:app',
        'concat:admin',
        'concat_css:admin',
        'clean:app',
        'watch:admin'
    ]);

    grunt.registerTask('admin_prod', [
        'jshint:admin',
        'less:admin',
        'concat:admin',
        'uglify:admin',
        'clean:app',
        'concat_css:admin',
        'cssmin:app',
        'watch:admin'
    ]);
};