myApp.controller('ButtonsController',
    function ButtonsController($scope, $http){
        $scope.check = function (answer, answerForm){
            var successCallback = function(data){
                if(data.data && typeof data.data === 'string') data.data = JSON.parse(data['data']);
                $scope.trlist = data.data;
                console.info('checkall - ',data.data);
            };
            $http.get("/api/checkall").then(successCallback, successCallback);
        };

        $scope.delete = function (id){

            var successCallback = function(data){
                console.info('remove - ',data);
            };


            $http.post("/api/remove", JSON.stringify({id: String(id)})).then(successCallback, successCallback);
        };

        $scope.iddids = function (id){

            var successCallback = function(data){
                console.info('remove - ',data);
            };


            $http.get("/api/addids").then(successCallback, successCallback);
        };

        $scope.decrease = function (id){

            var successCallback = function(data){
                console.info('remove - ',data);
            };


            $http.post("/api/decrease", JSON.stringify({id: String(id)})).then(successCallback, successCallback);
        };
    }
);