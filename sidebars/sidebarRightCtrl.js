deepwaterControllers.controller('SidebarRightCtrl', function($scope, $http){
    $scope.commits=[];
    function get(target_url){
        return new Promise(function(resolve, reject){
            //Query the GitHub api to get a list of the recent commits in my repos
            var commit_req = new XMLHttpRequest()
            commit_req.onload = function(){
                if(this.status == 200){
                    resolve(this.response); 
                }
                else{
                    reject(Error(this.statusText)); 
                }
            };
            commit_req.open('get', target_url)
            commit_req.send()
        });
    }
    $scope.getCommits = function(){
    // function getCommits(){
        get("https://api.github.com/users/deepwatercreations/repos?type=public").then(function(response){
            repos = JSON.parse(response);
            var commits_urls = [];
            for(i in repos){
                commits_urls.push(repos[i].commits_url);
            }
            // console.log(commits_urls);

            return new Promise(function(resolve, reject){
                var commits = [];
                var urls_gotten = 0;
                commits_urls.forEach(function(url){
                    var parsed_url = url.slice(0, url.indexOf("{//sha}"));
                    console.log(parsed_url);
                    // get(parsed_url).then(function(response){
                    //     console.log(this);
                    //     urls_gotten += 1;
                    //     commits.push(JSON.parse(response));
                    //     if(urls_gotten >= commits_urls.length){
                    //         resolve(commits);
                    //     }
                    // }, function(error){
                    //     reject(error); 
                    // }); 
                });
            });
        }).then(function(response){
            console.log(response);
        });
    }
});
