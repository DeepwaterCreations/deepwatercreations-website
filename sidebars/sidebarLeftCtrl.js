deepwaterControllers.controller('SidebarLeftCtrl', function($scope, $http){
    $scope.linkslist = [
        {
            title: "Oyster Squadron",
            desc: "",
            link: "http://connivance.net"
        },
        {
            title: "Wanderer RPG Podcast",
            desc: "",
            link: "http://wanderer-rpg.com"
        },
        {
            title: "Partysheephats",
            desc: "",
            link: "https://partysheephats.com"
        },
        {
            title: "Dash Dev",
            desc: "",
            link: "https://dashdv.wordpress.com"
        },
        {
            title: "Worlds Without Master",
            desc: "",
            link: "http://www.worldswithoutmaster.com"
        }
    ];
    $scope.goToLink = function(link){
        window.location.href = link;
    };
});
