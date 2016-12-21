myApp.controller('TableController',
    function TableController($scope, $http){

        var checkFunction = function(){
            $http.get('/api/check').success(function(data) {
                if(data && typeof data === 'string') data = JSON.parse(data);
                console.info('check - ',data, typeof data);

                $scope.actualtrlist = data.actual;
                $scope.donetrlist   = data.done;
                $scope.periodtrlist = data.periodic;
            });
        };

        checkFunction();
        setInterval(checkFunction, 5000*10000);

        //$http.get('/api/periodic').success(function(data) {
        //    if(data && typeof data === 'string') data = JSON.parse(data);
        //    console.info('data - ',data, typeof data);
        //    $scope.perlist = data;
        //});

    }
);