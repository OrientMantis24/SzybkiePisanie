angular.module('szybkiePisanie')
    .controller("ProfileCtrl", ["$scope", "$firebaseAuth", "$rootScope", function ($scope, $firebaseAuth, $rootScope) {
        var user = firebase.auth().currentUser;

        $scope.sendVerificationEmailFunction = function() {
            debugger;
            user = firebase.auth().currentUser;
            user.sendEmailVerification().then(function () {
                    $rootScope.sendVerificationEmail = false;
                    $rootScope.verificationEmailSent = true;
                    $rootScope.showVerificationStatus = false;
                    $scope.$apply();
                    $rootScope.$apply();
                
            }, function (error) { alert(error) })
        }
    }]);