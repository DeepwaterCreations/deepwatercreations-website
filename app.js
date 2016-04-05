var deepwaterApp = angular.module('deepwaterApp', [
        'ngRoute',
        'deepwaterControllers'
]);

deepwaterApp.config(['$routeProvider',
    function($routeProvider){
        $routeProvider.
        when('/blog',{
            templateUrl: 'blog/blogView.html',
            controller: 'BlogCtrl'
        }).
        otherwise({
            redirectTo: '/blog'
        });
    }]);
