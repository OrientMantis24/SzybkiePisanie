angular.module('szybkiePisanie')
    .controller('SignInCtrl', ["$scope", "$rootScope", "$firebaseAuth", function ($scope, $rootScope, $firebaseAuth) {
        $scope.user = {
            "email":"",
            "password": ""
        };
        $scope.SignIn = function (event) {
            console.log($scope.user.email);
            if ($scope.user.email != "") var email = $scope.user.email; else { $rootScope.makeAlert("Wpisz adres e-mail", "danger"); return; }
            if ($scope.user.password != "") var password = $scope.user.password; else { $rootScope.makeAlert("Wpisz hasło", "danger"); return; }
            firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {                
                var errorCode = error.code;
                var errorMessage = error.message;
                if (errorCode === 'auth/wrong-password') {
                    $rootScope.makeAlert('Błędne hasło.', "danger");
                }
                else if (errorCode === 'auth/invalid-email') {
                    $rootScope.makeAlert('Nieprawidłowy adres email', "danger");
                }
                else if (errorCode === 'auth/user-disabled') {
                    $rootScope.makeAlert('Użytkownik zablokowany', "danger");
                }
                else if (errorCode) {
                    $rootScope.makeAlert(errorMessage, "danger");
                }
            })
        }
    }
]);