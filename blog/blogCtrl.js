deepwaterControllers.controller('BlogCtrl', function($scope, $http){
    //Get the blog posts from the PHP script that 
    //queries the database.
    var blogposts = [];
    var keywords = [];
    $http.get('blogconnect.php').success(function(data){
        //Run the data through the post parser to interpret 
        //any hand-rolled markup I might be using.
        data.forEach(function(post){
            blogposts.push(PostParser.parse(post));

            //Put unique keywords into the keyword list.
            //TODO: Conceivably, there may be scalability problems here down the road.
            //Can MySQL do this faster? It probably can.
            var post_keywords = post.keywords.split(",");
            post_keywords.forEach(function(word){
                //Strip whitespace from beginning and end.
                word = word.replace(/^\s+|\s+$/g,'');
                if(keywords.indexOf(word) === -1){
                    keywords.push(word);
                }
            });
        });
    });

    $scope.current_page = 0; 
    var posts_per_page = 10;

    //Returns the blog posts for the current page
    $scope.getPagePosts = function(){
        var firstpagepost = $scope.current_page * posts_per_page;
        return blogposts.slice(firstpagepost, firstpagepost + posts_per_page);
    };

    //Returns the page number of the oldest page.
    function oldestPageNumber(){
        return Math.floor(blogposts.length / posts_per_page);
    }

    //Changes the page
    //Higher page number means older posts.
    $scope.lastPage = function(){
        $scope.current_page = 0;
    }
    $scope.nextPage = function(){
        $scope.current_page--;    
        if($scope.current_page < 0)
            $scope.current_page = 0;
    };
    $scope.prevPage = function(){
        $scope.current_page++;   
    };
    $scope.firstPage = function(){
        $scope.current_page = oldestPageNumber();
    }

    //Check if we're on the first or last page.
    $scope.isNewestPage = function(){
        return $scope.current_page <= 0;
    }
    $scope.isOldestPage = function(){
        return $scope.current_page >= oldestPageNumber();
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
});
