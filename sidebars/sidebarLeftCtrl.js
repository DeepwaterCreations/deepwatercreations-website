deepwaterControllers.controller('SidebarLeftCtrl', function($scope, $http){
    $scope.linkslist = [
        {
            title: "Dash Dev",
            desc: "My friend Colin makes android apps and cool stuff.",
            link: "https://dashdv.wordpress.com/"
        },
        {
            title: "Oyster Squadron",
            desc: "I did not put this website in my list \
                of sidebar links. The link showed up unexpectedly \
                one day, complete with this very description \
                of itself. I wouldn't click it if I were you. This \
                site's pretty weird.",
            link: "http://connivance.net/"
        },
        {
            title: "Partysheephats",
            desc: "My friend Chris investigates quirky subjects in \
                economics.",
            link: "https://partysheephats.com"
        } 
    ];
    $scope.goToLink = function(link){
        window.location.href = link;
    };
});
