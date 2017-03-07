angular.module('szybkiePisanie')
    .controller('RegisterCtrl', ["$scope", "$firebaseAuth", function ($scope, $firebaseAuth) {
        $scope.Register = function (event) {
            if ($scope.user.email != undefined) var email = $scope.user.email; else { alert("Wpisz mejl"); return; }
            if ($scope.user.password != undefined) var password = $scope.user.password; else { alert("Wpisz haslo"); return; }
            firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;

                if (email.length < 4) {
                    alert('Please enter an email address.');
                    return;
                }
                if (password.length < 4) {
                    alert('Please enter a password.');
                    return;
                }
            })
        }
    }]);