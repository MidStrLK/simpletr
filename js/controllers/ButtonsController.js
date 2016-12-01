myApp.controller('ButtonsController',
    function ButtonsController($scope, $http){
        $scope.check = function (answer, answerForm){
            var successCallback = function(data){
                if(data.data && typeof data.data === 'string') data.data = JSON.parse(data.data);
                $scope.trlist = data.data;
                console.info('data - ',data.data);
            };
            $http.get("/check").then(successCallback, successCallback);
        };
    }
);