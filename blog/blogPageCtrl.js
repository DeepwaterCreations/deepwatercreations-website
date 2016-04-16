deepwaterControllers.controller('BlogPageCtrl', function($scope, $routeParams, $http){
    $scope.post = {};
    $http.get('blogconnect.php', {params: {ID: $routeParams.ID}}).
        then(function(data){
            $scope.post = data.data[0];          
        });
});
