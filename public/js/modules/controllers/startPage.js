app.controller('startPageController', ['$scope', 'NewsManager', 'GeneralHelpers',
    function ($scope, NewsManager, GeneralHelpers) {

    var self = this;

    this.news = [{
        image: 'http://www.saturdayeveningpost.com/wp-content/uploads/satevepost/photo_2009-12_26_biomedical_research-400x300.jpg',
        title: 'Doctor',
        date: new Date(),
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eleifend nisi lectus, ut maximus mauris ' +
        'condimentum eget. Nulla facilisi. Mauris vel ante aliquet, feugiat nulla eu, mollis libero. Fusce tristique ' +
        'tellus at urna porttitor hendrerit. Maecenas vel facilisis sem. Vivamus eu pretium ipsum, sed blandit sapien. ' +
        'Quisque finibus aliquet nulla, id venenatis erat elementum ac. Quisque fringilla nulla lorem, eget suscipit ' +
        'massa porttitor non. Donec tempus mi velit, non venenatis erat condimentum sit amet. Nunc vehicula nulla nec ' +
        'massa vestibulum ornare. Pellentesque a metus et ligula mattis faucibus. Mauris ultricies nisl sit amet nunc ' +
        'bibendum mollis. Proin nec fringilla mi. Nullam bibendum felis ac ex aliquet, ac tincidunt orci tempor.' +
        ' Suspendisse potenti.'
    },
    {
        image: 'http://cdn1.medicalnewstoday.com/content/images/articles/284/284381/pills.jpg',
        title: 'Pills',
        date: new Date(),
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eleifend nisi lectus, ut maximus mauris ' +
        'condimentum eget. Nulla facilisi. Mauris vel ante aliquet, feugiat nulla eu, mollis libero. Fusce tristique ' +
        'tellus at urna porttitor hendrerit. Maecenas vel facilisis sem. Vivamus eu pretium ipsum, sed blandit sapien. ' +
        'Quisque finibus aliquet nulla, id venenatis erat elementum ac. Quisque fringilla nulla lorem, eget suscipit ' +
        'massa porttitor non. Donec tempus mi velit, non venenatis erat condimentum sit amet. Nunc vehicula nulla nec ' +
        'massa vestibulum ornare. Pellentesque a metus et ligula mattis faucibus. Mauris ultricies nisl sit amet nunc ' +
        'bibendum mollis. Proin nec fringilla mi. Nullam bibendum felis ac ex aliquet, ac tincidunt orci tempor.' +
        ' Suspendisse potenti.'
    },
    {
        image: 'http://a.abcnews.com/images/Health/GTY_cat_scan_jef_141203_16x9_992.jpg',
        title: 'MRT',
        date: new Date(),
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eleifend nisi lectus, ut maximus mauris ' +
        'condimentum eget. Nulla facilisi. Mauris vel ante aliquet, feugiat nulla eu, mollis libero. Fusce tristique ' +
        'tellus at urna porttitor hendrerit. Maecenas vel facilisis sem. Vivamus eu pretium ipsum, sed blandit sapien. ' +
        'Quisque finibus aliquet nulla, id venenatis erat elementum ac. Quisque fringilla nulla lorem, eget suscipit ' +
        'massa porttitor non. Donec tempus mi velit, non venenatis erat condimentum sit amet. Nunc vehicula nulla nec ' +
        'massa vestibulum ornare. Pellentesque a metus et ligula mattis faucibus. Mauris ultricies nisl sit amet nunc ' +
        'bibendum mollis. Proin nec fringilla mi. Nullam bibendum felis ac ex aliquet, ac tincidunt orci tempor.' +
        ' Suspendisse potenti.'
    }];

    function getNews () {

        var params = {
            limit: 3
        };

        NewsManager.getNewsList(params, function(err, hospitals) {
            if (err) {
                return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
            }

            hospitals[0].image = 'http://www.saturdayeveningpost.com/wp-content/uploads/satevepost/photo_2009-12_26_biomedical_research-400x300.jpg';
            hospitals[1].image = 'http://cdn1.medicalnewstoday.com/content/images/articles/284/284381/pills.jpg';
            hospitals[2].image = 'http://a.abcnews.com/images/Health/GTY_cat_scan_jef_141203_16x9_992.jpg';

            self.news = hospitals;
        });
    }

    getNews();
}]);