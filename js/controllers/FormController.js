myApp.controller('FormController',
    function AnswerController($scope, $http){

        $http.get('/api/getcombo').success(function(data) {
            $scope.trlist = data;
        });

        $scope.response={};
        $scope.save = function (answer, answerForm){
            if(answerForm && answerForm.$valid){
                $http.post("/api/add", answer).success(function (answ) {
                    console.log('add - ', answ);
                });

                $scope.answer = null;
            }
        };
    }
);