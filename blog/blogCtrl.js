deepwaterControllers.controller('BlogCtrl', function($scope, $http, $timeout){
    $scope.showSearchPanel = false;

    var posts_per_page = 10;
    var total_posts = 0;
    $scope.current_page = 0;
    $scope.oldest_page_number = -1; 

    //Get the blog posts from the PHP script that 
    //queries the database.
    $scope.blogposts = [];
    var keywords = [];
    $scope.obj = {}
    $scope.obj.filter_keywords = "";

    $timeout(function(){
        getPostsFromDB($scope.current_page, posts_per_page);
        $scope.oldest_page_number = getOldestPageNumberFromDB(); 
    });

    //Gets num_posts posts starting at id == offset from the db,
    //parses them, and replaces blogposts with the results.
    var getPostsFromDB = function(page_num, page_size){
        var blogconnect_params = {
            page_num: page_num || $scope.current_page,
            page_size: page_size || posts_per_page
        };
        $http.get('blogconnect.php', {params: blogconnect_params}).success(function(data){
            //Run the data through the post parser to interpret 
            //any hand-rolled markup I might be using.
            $scope.blogposts = [];
            data.forEach(function(post){
                $scope.blogposts.push(PostParser.parse(post));
            });
        });
    };

    //Returns the page number of the oldest page, based on
    //the total number of posts in the database.
    var getOldestPageNumberFromDB = function(){
        $http.get('blogconnect.php', {params: {querytype: "postcount"}}).success(function(data){
            var count = data[0][0];
            $scope.oldest_page_number = Math.floor(count / posts_per_page);
        }); 
    };

    //Changes the page
    //Higher page number means older posts.
    $scope.lastPage = function(){
        $scope.current_page = 0;
        getPostsFromDB($scope.current_page, posts_per_page);
    }
    $scope.nextPage = function(){
        $scope.current_page--;    
        if($scope.current_page < 0)
            $scope.current_page = 0;
        getPostsFromDB($scope.current_page, posts_per_page);
    };
    $scope.prevPage = function(){
        $scope.current_page++;   
        if($scope.current_page > $scope.oldest_page_number)
            $scope.current_page = $scope.oldest_page_number;
        getPostsFromDB($scope.current_page, posts_per_page);
    };
    $scope.firstPage = function(){
        $scope.current_page = $scope.oldest_page_number;
        getPostsFromDB($scope.current_page, posts_per_page);
    }

    //Check if we're on the first or last page.
    $scope.isNewestPage = function(){
        return $scope.current_page <= 0;
    }
    $scope.isOldestPage = function(){
        return $scope.current_page >= $scope.oldest_page_number;
        // if($scope.blogposts.length == 0){
        //     return false;
        // }
        // return $scope.blogposts[$scope.blogposts.length-1].id == 0;
    }

    //Return text stating the number of comments for the given post.
    $scope.getCommentCountText = function(post){
        if(post.comments < 1){
            return "No Comments";
        }

        if(post.comments === 1){
            return "One Comment";
        }

        if(post.comments > 1){
            return post.comments + " Comments";
        }
    };

    //Show or hide the search/filter panel
    $scope.toggleSearch = function(){
        $scope.showSearchPanel = !$scope.showSearchPanel; 
    };
});
