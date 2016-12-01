myApp.controller('TableController',
    function TableController($scope, $http){

        setInterval(function(){
            $http.get('/check').success(function(data) {


                if(data && typeof data === 'string') data = JSON.parse(data);
                console.info('data - ',data, typeof data);
                $scope.trlist = data;
            });
        }, 5000);
    }
);