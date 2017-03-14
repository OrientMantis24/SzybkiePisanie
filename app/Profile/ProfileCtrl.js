angular.module('szybkiePisanie')
<<<<<<< HEAD
    .controller("ProfileCtrl", ["$scope", "$firebaseAuth", function ($scope, $firebaseAuth) {
        $scope.email;
=======
    .controller("ProfileCtrl", ["$scope", "$firebaseAuth", "$rootScope", function ($scope, $firebaseAuth, $rootScope) {
>>>>>>> origin/master
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
<<<<<<< HEAD
        });
        if (user) {
            $scope.email = user.email;
            if (user.emailVerified === false) {
                document.getElementById('emailVerified').textContent = 'nie';
                document.getElementById('emailVerifiedRow').className = 'danger';
                document.getElementById('activationEmail').hidden = false;
            }
            else {
                document.getElementById('emailVerified').textContent = 'tak';
                document.getElementById('emailVerifiedRow').className = 'success';
            }
        }
        else {
            $scope.email = "";
            document.getElementById('emailVerified').textContent = "";
=======
>>>>>>> origin/master
        }
    }]);