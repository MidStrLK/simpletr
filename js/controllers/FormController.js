myApp.controller('FormController',
    function AnswerController($scope, $http){

        $http.get('/getcombo').success(function(data) {
            console.info('data - ',data);
            $scope.trlist = data;
        });

        $scope.response={};
        $scope.save = function (answer, answerForm){
            if(answerForm && answerForm.$valid){
                $http.post("/add", answer).success(function (answ) {
                    console.log('arguments - ', arguments);
                });
            }
        };
    }
);