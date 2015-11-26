/**
 * Created by vasylhoshovsky on 25.11.15.
 */
app.controller('editStaticNewController', ['$scope', '$routeParams', '$location', 'StartSideManager', 'GeneralHelpers',
    function ($scope, $routeParams, $location, StartSideManager, GeneralHelpers) {
        var self = this;
        self.staticNewId = $routeParams.id;
        self.position = $routeParams.position;

        self.staticNew = {};
        self.title = 'Update article';

        self.saveStaticNew = saveStaticNew;
        self.cropResult = cropResult;
        self.checkImageType = checkImageType;
        self.removeImage = removeImage;

        if (self.staticNewId) {
            getStaticNew();
        } else {
            self.staticNew.position = self.position;
            self.title = 'Create article';
        }


        /**
         * Launch update function in case of id presence in route params or launch create function otherwise
         */
        function saveStaticNew() {
            if (self.staticNewId) {
                updateStaticNew();
            } else {
                createStaticNew();
            }
        }

        /**
         * Update database entry with user data
         * Consumes self.staticNewId, self.staticNew
         */
        function updateStaticNew() {

            StartSideManager.editStaticNews(self.staticNewId, self.staticNew, function(err, response) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                $location.path('startside');

            });


        }

        /**
         * Create new entry in database with user defined information
         * It needs self.staticNew to be available
         */
        function createStaticNew() {

            StartSideManager.createStaticNews(self.staticNew, function(err, response) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                $location.path('startside');

            });

        }

        /**
         * Fetch static new from db by id from route params
         * In case of success this entity is stored in self.staticNew
         */
        function getStaticNew() {

            StartSideManager.getStaticNew(self.staticNewId, function (err, response) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                self.staticNew = response;
                self.oldImage = response.image;
            });
        }

        function cropResult (croppedImageBase64, type) {
            self.staticNew[type] = croppedImageBase64;
        }

        function checkImageType (name) {
            var imageContent = self[name];

            /*if (!imageContent) {
             return;
             }

             Client.checkFileType(imageContent, function (err, response) {
             if (err) {
             self.removeImage(name);
             return ErrMsg.show({message: err.data.error, status: err.status});
             }

             if (!response.validImage) {
             self.removeImage(name);
             return alert ('File is not image');
             }
             });*/
        }

        function removeImage(name) {
            self.staticNew[name] = null;
            self[name] = null;
            $('#' + name).val(null);
            $( '#' + name + '-slider').slider('disable');
        }


    }]);