angular.module('szybkiePisanie')
    .controller('SignInCtrl', ["$scope", "$firebaseAuth", function ($scope, $firebaseAuth) {
        $scope.SignIn = function (event) {
            debugger;
            if ($scope.user.email != undefined) var email = $scope.user.email; else { alert("Wpisz adres e-mail"); return; }
            if ($scope.user.password != undefined) var password = $scope.user.password; else { alert("Wpisz hasło"); return; }
            firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {                
                var errorCode = error.code;
                var errorMessage = error.message;

                if (email.length < 4) {
                    alert('Proszę wpisać adres email.');
                    return;
                }
                if (password.length < 4) {
                    alert('Proszę wpisać hasło.');
                    return;
                }
                ;
                if (errorCode === 'auth/wrong-password') {
                    alert('Błędne hasło.');
                }
                else if (errorCode === 'auth/invalid-email') {
                    alert('Nieprawidłowy adres email');
                }
                else if (errorCode === 'auth/user-disabled') {
                    alert('Użytkownik zablokowany');
                }
                else if (errorCode) {
                    alert(errorMessage);
                }
            })
        }
    }
]);