app.controller('hospitalController', ['$scope', 'GeneralHelpers',
    function ($scope, GeneralHelpers) {
        var self = this;

        //$scope.itemsPerPage = GeneralHelpers.getLocalData('resultater');

        this.hospital = {
            image: 'http://www.freelargeimages.com/wp-content/uploads/2015/05/Hospital_Logo_02.png',
            title: 'New Hospital',
            created_at: new Date(),
            phone: '+9379992',
            details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sed tortor dolor. Nullam eu aliquam ' +
            'libero. In ac ultrices odio, eu imperdiet arcu. Nullam sagittis consectetur orci. Aliquam lacinia nisi eu ' +
            'vestibulum suscipit. Proin finibus leo ac dapibus ornare. Pellentesque nisi massa, scelerisque sit amet ' +
            'quam nec, porta lobortis odio. Aliquam ullamcorper, nibh varius fringilla molestie, felis lorem aliquam ' +
            'arcu, eget posuere erat leo id leo. Nam pulvinar mauris vulputate magna mollis ornare. Quisque vitae ' +
            'varius justo, ut rhoncus velit.',
            address: '93 Cottonwood Drive  North York' +
            ' ON M3C 2B3 Canada',
            is_paid: true,
            email: 'new@hosp.com',
            latitude: 32,
            longitude: 23
        };
    }]);