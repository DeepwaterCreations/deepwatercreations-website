deepwaterControllers.controller('BlogCtrl', function($scope, $http){
    //Get the blog posts from the PHP script that 
    //queries the database.
    var blogposts = [];
    $http.get('blogconnect.php').success(function(data){
        blogposts = data;
    });

    $scope.current_page = 0; 
    var posts_per_page = 10;

    //Returns the blog posts for the current page
    $scope.getPagePosts = function(){
        var firstpagepost = $scope.current_page * posts_per_page;
        return blogposts.slice(firstpagepost, firstpagepost + posts_per_page);
    };
});
