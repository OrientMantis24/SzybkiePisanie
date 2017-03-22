angular.module('szybkiePisanie')
    .controller('RegisterCtrl', ["$scope", "$rootScope", "$firebaseAuth", function ($scope, $rootScope, $firebaseAuth) {
        $scope.user = {
            "email":"",
            "password":""
        }
        $scope.Register = function (event) {
            if ($scope.user.email != "") var email = $scope.user.email; else { $rootScope.makeAlert("Wpisz adres e-mail", "danger"); return; }
            if ($scope.user.password != "") var password = $scope.user.password; else { $rootScope.makeAlert("Wpisz hasło", "danger"); return; }
            firebase.auth().createUserWithEmailAndPassword(email, password).then(function(){
                $rootScope.justRegistered = true;
            })
            .catch(function (error) {
                $scope.errorCode = error.code;
                $scope.errorMessage = error.message;

                if($scope.errorCode == "auth/email-already-in-use"){
                    $rootScope.makeAlert("Na ten adres e-mail jest już zarejestrowane konto", "danger");
                }

                else if($scope.errorCode == "auth/invalid-email") {
                    $rootScope.makeAlert("Adres e-mail nie jest prawidłowy", "danger");
                }

                else if($scope.errorCode == "auth/operation-not-allowed") {
                    $rootScope.makeAlert("Operacja nie udała się", "danger");
                }

                else if($scope.errorCode == "auth/weak-password") {
                    $rootScope.makeAlert("Zbyt słabe hasło", "danger");
                }
        })
    }}]);