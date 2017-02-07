// create the module and name it szybkiePisanie
var szybkiePisanie = angular.module('szybkiePisanie', ['ngRoute', 'firebase']);

// configure our routes
szybkiePisanie.config(function ($routeProvider) {
    $routeProvider

        // route for the home page
        .when('/', {
            templateUrl: 'pages/home.html',
        })

        .when('/home', {
            templateUrl: 'pages/home.html',
        })

        .when('/signin', {
            templateUrl: 'pages/signin.html',
            controller: 'SignInCtrl'
        })

        .when('/register', {
            templateUrl: 'pages/register.html',
            controller: 'RegisterCtrl'
        });
});

szybkiePisanie.controller('RegisterCtrl', ["$scope", "$firebaseAuth", function ($scope, $firebaseAuth) {


    $scope.Register = function (event) {
        debugger;
        var successful = true;
        if ($scope.user.email != undefined) var email = $scope.user.email; else { alert("Wpisz mejl"); return; }
        if ($scope.user.password != undefined) var password = $scope.user.password; else { alert("Wpisz haslo"); return; }
        firebase.auth().createUserWithEmailAndPassword(email, password).then(AuthSuccessful(), function (error) {
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

            alert(error);
            console.log(error);
            return;
        }).finally(
            AuthSuccessful()
        )
    }

    
    function AuthSuccessful(){
        debugger;
        alert("success");
    }

}]);


szybkiePisanie.controller("SignInCtrl", ["$scope", "$firebaseAuth",
    function ($scope, $firebaseAuth) {





        $scope.SignIn = function (event) {
            debugger;
            console.log("hello");
            if ($scope.user.email != undefined) var email = $scope.user.email; else { alert("Wpisz mejl"); return; }
            if ($scope.user.password != undefined) var password = $scope.user.password; else { alert("Wpisz haslo"); return; }
            firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
                // Handle Errors here.
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

                if (errorCode === 'auth/wrong-password') {
                    alert('Wrong password.');
                } else {
                    alert(errorMessage);
                }
                console.log(error);
            });

            alert("zalogowano!");
        }
    }
]);