deepwaterControllers.controller('BlogCtrl', function($scope, $http){
    //Get the blog posts from the test json file. Later, from the PHP script that 
    //queries the database.
    $http.get('blogconnect.php').success(function(data){
        $scope.blogposts = data;
    });
});
