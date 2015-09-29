app.controller('sentereController', ['$scope', function ($scope) {
    var self = this;

    $scope.curPage = 1;
    $scope.totalItems = 2;
    $scope.itemsPerPage = 2;

    this.hospitals = [{
        image: 'http://www.freelargeimages.com/wp-content/uploads/2015/05/Hospital_Logo_02.png',
        title: 'New Hospital',
        created_at: new Date(),
        phone: '+9379992',
        details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eleifend nisi lectus, ut maximus mauris ' +
        'condimentum eget. Nulla facilisi. Mauris vel ante aliquet, feugiat nulla eu, mollis libero. Fusce tristique ' +
        'tellus at urna porttitor hendrerit. Maecenas vel facilisis sem. Vivamus eu pretium ipsum, sed blandit sapien. ' +
        'Quisque finibus aliquet nulla, id venenatis erat elementum ac. Quisque fringilla nulla lorem, eget suscipit ' +
        'massa porttitor non. Donec tempus mi velit, non venenatis erat condimentum sit amet. Nunc vehicula nulla nec ' +
        'massa vestibulum ornare. Pellentesque a metus et ligula mattis faucibus. Mauris ultricies nisl sit amet nunc ' +
        'bibendum mollis. Proin nec fringilla mi. Nullam bibendum felis ac ex aliquet, ac tincidunt orci tempor.' +
        ' Suspendisse potenti.',
        address: '93 Cottonwood Drive' +
        ' North York' +
        ' ON M3C 2B3' +
        ' Canada',
        is_paid: true,
        web_page: 'https://www.google.com',
        latitude: 32,
        longitude: 23
    },
    {
        image: 'http://www.freelargeimages.com/wp-content/uploads/2015/05/Hospital_Logo_02.png',
        title: 'Old Hospital',
        created_at: new Date(),
        phone: '+9379992',
        details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eleifend nisi lectus, ut maximus mauris ' +
        'condimentum eget. Nulla facilisi. Mauris vel ante aliquet, feugiat nulla eu, mollis libero. Fusce tristique ' +
        'tellus at urna porttitor hendrerit. Maecenas vel facilisis sem. Vivamus eu pretium ipsum, sed blandit sapien. ' +
        'Quisque finibus aliquet nulla, id venenatis erat elementum ac. Quisque fringilla nulla lorem, eget suscipit ' +
        'massa porttitor non. Donec tempus mi velit, non venenatis erat condimentum sit amet. Nunc vehicula nulla nec ' +
        'massa vestibulum ornare. Pellentesque a metus et ligula mattis faucibus. Mauris ultricies nisl sit amet nunc ' +
        'bibendum mollis. Proin nec fringilla mi. Nullam bibendum felis ac ex aliquet, ac tincidunt orci tempor.' +
        ' Suspendisse potenti.',
        address: '93 Cottonwood Drive' +
        ' North York' +
        ' ON M3C 2B3' +
        ' Canada',
        is_paid: false,
        web_page: 'https://www.google.com',
        latitude: 32,
        longitude: 23
    }];
}]);