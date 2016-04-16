var deepwaterApp = angular.module('deepwaterApp', [
        'ngRoute',
        'ngSanitize',
        'deepwaterControllers'
]);

deepwaterApp.config(['$routeProvider',
    function($routeProvider){
        $routeProvider.
        when('/blog',{
            templateUrl: 'blog/blogView.html',
            controller: 'BlogCtrl'
        }).
        when('/blog/:ID',{
            templateUrl: 'blog/blogPageView.html',
            controller: 'BlogPageCtrl'
        }).
        otherwise({
            redirectTo: '/blog'
        });
    }]);
