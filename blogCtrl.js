deepwaterApp.controller('BlogCtrl', function($scope, $http){

    //Get the blog posts from the test json file. Later, from the PHP script that 
    //queries the database.
    $http.get('testblog.json').success(function(data){
        $scope.blogposts = data;
    });
});
