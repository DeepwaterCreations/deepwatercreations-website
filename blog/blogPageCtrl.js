deepwaterControllers.controller('BlogPageCtrl', function($scope, $routeParams, $http){
    $scope.post = {};
    $scope.comments = [];
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
});
