myApp.controller('DropdownController',
    function ($scope, $http) {
        $scope.selectedTestAccount = null;
        $scope.testAccounts = [];

        $http({
            method: 'GET',
            url: '/api/getcombo',
            data: {applicationId: 3}
        }).success(function (result) {
            $scope.testAccounts = result;
        });
    }
);