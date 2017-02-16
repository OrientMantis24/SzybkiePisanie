// create the module and name it szybkiePisanie
var szybkiePisanie = angular.module('szybkiePisanie', ['ngRoute', 'firebase']);

// configure our routes
szybkiePisanie.config(function ($routeProvider) {
    $routeProvider

        // route for the home page
        .when('/', {
            templateUrl: 'pages/home.html',
        })

        .when('/signin', {
            templateUrl: 'pages/signin.html',
            controller: 'SignInCtrl'
        })

        .when('/profile', {
            templateUrl: 'pages/profile.html',
            controller: 'ProfileCtrl'
        })

        .when('/register', {
            templateUrl: 'pages/register.html',
            controller: 'RegisterCtrl'
        })

        .when('/practice', {
            templateUrl: 'pages/practice.html',
            controller: 'PracticeCtrl'
        });
});

szybkiePisanie.controller('RegisterCtrl', ["$scope", "$firebaseAuth", function ($scope, $firebaseAuth) {


    $scope.Register = function (event) {
        debugger;
        var successful = true;
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

            alert(error);
            console.log(error);
            return;
        }
        )
    }
}]);


szybkiePisanie.controller("SignInCtrl", ["$scope", "$firebaseAuth", function ($scope, $firebaseAuth) {
    $scope.SignIn = function (event) {
        if ($scope.user.email != undefined) var email = $scope.user.email; else { alert("Wpisz adres e-mail"); return; }
        if ($scope.user.password != undefined) var password = $scope.user.password; else { alert("Wpisz hasło"); return; }
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
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
    }
}
]);

szybkiePisanie.controller("ProfileCtrl", ["$scope", "$firebaseAuth", function ($scope, $firebaseAuth) {

    var user = firebase.auth().currentUser;
    document.getElementById('activationEmail').addEventListener('click', function () { user.sendEmailVerification().then(function () { alert("Wysłano mejl aktywacyjny!"); }, function (error) { alert(error) }) });
    if (user) {
        document.getElementById('email').textContent = user.email;
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
        document.getElementById('email').textContent = "";
        document.getElementById('emailVerified').textContent = "";
    }
}

]);

szybkiePisanie.controller("PracticeCtrl", ["$scope", "$firebaseAuth", function ($scope, $firebaseAuth) {
    debugger;
    var randomNumber = Math.floor((Math.random() * 1) + 0);
    var counter = 0;
    var start = 0;

    
        firebase.database().ref('Texts/' + randomNumber.toString()).once('value').then(function (snapshot) {
        debugger;
        var text = snapshot.val().Text;
        var textSplit = text.split(' ');

        document.getElementById('nohighlight').textContent = "";
        document.getElementById('nohighlight').textContent = textSplit[0] + ' ';
        document.getElementById('nohighlight').style.fontSize = "120%";
        document.getElementById('highlight').style.fontSize = "120%";
        document.getElementById('wholeText').style.float = "left";
        for (var i = 1; i < textSplit.length; i++) {
            document.getElementById('text').textContent += (textSplit[i] + ' ');
        }
        var user = firebase.auth().currentUser;
    })

    document.getElementById('inputBox').addEventListener('input', function () {

        debugger;
        var firstWord = document.getElementById('firstWord').textContent.split(' ');
        var textTable = text.textContent.split(' ');
        console.log(textTable);
        if (start == 0) {
            var date = new Date();
            start = date.getTime();
        }
        var date = new Date();
        var stop = date.getTime();
        var time = stop - start;
        debugger;
        var input = document.getElementById('inputBox').value;

        switch (input) {
            case (firstWord[0] + ' '):
                document.getElementById('text').textContent = "";
                document.getElementById('nohighlight').textContent = "";
                document.getElementById('inputBox').value = "";
                counter++;
                document.getElementById('wordsperminute').textContent = "Słowa na minutę: " + Math.floor(counter / (time / 1000 / 60));
                document.getElementById('nohighlight').textContent += textTable[0] + ' ';
                document.getElementById('highlight').textContent = "";
                for (var i = 1; i < textTable.length-1; i++) {
                    document.getElementById('text').textContent += (textTable[i] + ' ');
                }
                break;
            case ' ':
                document.getElementById('inputBox').value = "";
                break;
                case (firstWord[0]):
                if (textTable.length==1){
                document.getElementById('inputBox').value = "";
                counter++;
                document.getElementById('wordsperminute').textContent = "Słowa na minutę: " + Math.floor(counter / (time / 1000 / 60));
                alert("Wygrana!" + time / 1000 + " sekund.");
                counter = 0;}
            default:
                if(input == (firstWord[0] + ' ').substring(0, input.length))document.getElementById('highlight').style.backgroundColor = 'green';
                else document.getElementById('highlight').style.backgroundColor = 'red';

                document.getElementById('nohighlight').textContent = (firstWord[0] + ' ').substring(input.length, (firstWord[0] + ' ').length);
                document.getElementById('highlight').textContent = (firstWord[0] + ' ').substring(0, input.length);

        }
    });
}
]);

function initApp($window) {
    firebase.auth().onAuthStateChanged(function (user) {
        //debugger;
        if (user) {
            document.getElementById('notLoggedIn').hidden = true;
            document.getElementById('loggedIn').hidden = false;
            document.getElementById('profile').textContent = user.email;

            //Profile
            if (document.getElementById('email') !== null) {
                document.getElementById('email').textContent = user.email;
                if (user.emailVerified === false) {
                    document.getElementById('emailVerified').textContent = 'nie';
                    document.getElementById('emailVerifiedRow').className = 'danger';
                    document.getElementById('activationEmail').hidden = false;
                }
                else {
                    document.getElementById('emailVerified').textContent = 'tak';
                    document.getElementById('emailVerifiedRow').className = 'success';
                };
            }
        } else {
            debugger;
            document.getElementById('notLoggedIn').hidden = false;
            document.getElementById('loggedIn').hidden = true;
            document.getElementById('profile').textContent = "";
        }

        document.getElementById('profile').value = "";

        document.getElementById('logout').addEventListener('click', function () { firebase.auth().signOut(); }, false);
    })
};




window.onload = function ($window) {
    initApp($window);
};