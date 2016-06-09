deepwaterControllers.controller('BlogPageCtrl', function($scope, $routeParams, $http){
    $scope.post = {};
    $scope.comments = [];
    $scope.newcomment = {
        postid: $routeParams.ID,
        title: "",
        name: "",
        comment: ""
    };
    $http.get('blogconnect.php', {params: {ID: $routeParams.ID, querytype: "blogposts"}}).
        //Get the post content
        then(function(data){
            $scope.post = data.data[0];          
            $scope.post.keywords = $scope.post.keywords.split(',');
        }).
        //Get the comments
        then($http.get('blogconnect.php', {params: {ID: $routeParams.ID, querytype: "blogcomments"}}).then(function(data){
            $scope.comments = data.data; 
        }));

    //Add a new comment to the database
    $scope.postComment = function(){
        console.log($scope.newcomment);
        $http.post('insertblogcomment.php', $scope.newcomment).
            then(function(data){
                window.location.reload(true);
            });
    };
});
