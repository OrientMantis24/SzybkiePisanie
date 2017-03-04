// create the module and name it szybkiePisanie
var szybkiePisanie = angular.module('szybkiePisanie', ['ngRoute', 'firebase']);

// configure our routes
szybkiePisanie.config(function ($routeProvider) {
    $routeProvider

        // route for the home page
        .when('/', {
            templateUrl: 'pages/home.html',
            controller: 'HomeCtrl'
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


szybkiePisanie.controller('HomeCtrl', ["$scope", "$rootScope", "$firebaseAuth", "$interval", function ($scope, $rootScope, $firebaseAuth, $interval) {
    if (firebase.auth().currentUser == null) firebase.auth().signInAnonymously();

    $scope.results = [{}];
    console.log($scope.results[0]);
    console.log($scope.results[1]);

    for (i = 0; i < 10; i++) {
        firebase.database().ref('Latest/' + i.toString()).once('value').then(function (snapshot) {
            var Index = snapshot.val().Index;


            $scope.results[Index - 1] = ({
                'username': snapshot.val().user.toString(),
                'text': snapshot.val().text.toString(),
                'result': snapshot.val().speed.toString()
            });

            $scope.$apply();
            $('#loadingGif').fadeOut(200);
            $("#latestScoresTable").fadeIn(2000);
        })
    }

    $interval(function () {
        for (i = 0; i < 10; i++) {
            firebase.database().ref('Latest/' + i.toString()).once('value').then(function (snapshot) {
                var Index = snapshot.val().Index;


                $scope.results[Index - 1] = ({
                    'username': snapshot.val().user.toString(),
                    'text': snapshot.val().text.toString(),
                    'result': snapshot.val().speed.toString()
                });


            })
        }
    }, 5000);

}])

szybkiePisanie.controller('RegisterCtrl', ["$scope", "$firebaseAuth", function ($scope, $firebaseAuth) {


    $scope.Register = function (event) {
        ;
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
        if(firebase.auth().currentuser != null && firebase.auth().currentUser.isAnonymous)firebase.auth().signOut();
        var location = window.location;
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

szybkiePisanie.controller("ProfileCtrl", ["$scope", "$firebaseAuth", function ($scope, $firebaseAuth) {

    var user = firebase.auth().currentUser;
    document.getElementById('activationEmail').addEventListener('click', function () {
        user = firebase.auth().currentUser;
        user.sendEmailVerification().then(function () {
            document.getElementById('activationEmailSent').className = "label label-success";
            document.getElementById('activationEmailSent').hidden = false;
            document.getElementById('activationEmail').hidden = true;
        }, function (error) { alert(error) })
    });
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

szybkiePisanie.controller("PracticeCtrl", ["$scope", "$firebaseAuth", function ($scope, $firebaseAuth, $q) {
    ;
    var randomNumber = Math.floor((Math.random() * 2) + 0);
    var counter = 0;
    var start = 0;
    var textLength;
    $scope.wordsperminute;

    firebase.database().ref('Texts/' + randomNumber.toString()).once('value').then(function (snapshot) {
        var text = snapshot.val().Text;
        var textSplit = text.split(' ');
        textLength = textSplit.length;

        document.getElementById('nohighlight').textContent = "";
        document.getElementById('nohighlight').textContent = textSplit[0] + ' ';
        for (var i = 1; i < textSplit.length; i++) {
            document.getElementById('text').textContent += (textSplit[i] + ' ');
        }

        document.getElementById('progressBar').style.width = "0%";
        document.getElementById('Author').textContent = snapshot.val().Author;
        document.getElementById('Title').textContent = snapshot.val().Title;
        document.getElementById('trivia_image').src = snapshot.val().Image;
        document.getElementById('Text').textContent = snapshot.val().Trivia;
    }).catch(function (error) {
        firebase.auth().signInAnonymously().then(function () {
            window.location.reload();
        })
    }
        )



    document.getElementById('reloadButton').addEventListener('click', function () {
        //handleLastestScoresChange();
        window.location.reload();


        //$("#trivia").hide().fadeIn(2000);
        //$('#inputBox').hide();
        // $('.progress').hide();
        // $('#wholeText').hide();
    })

    document.getElementById('inputBox').addEventListener('input', function () {
        var firstWord = document.getElementById('firstWord').textContent.split(' ');
        var textTable = text.textContent.split(' ');
        if (start == 0) {
            var date = new Date();
            start = date.getTime();
        }
        var date = new Date();
        var stop = date.getTime();
        var time = stop - start;
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
                for (var i = 1; i < textTable.length - 1; i++) {
                    document.getElementById('text').textContent += (textTable[i] + ' ');
                }
                document.getElementById('progressBar').style.width = (Math.floor(counter / textLength * 100)).toString() + "%";
                document.getElementById('progressBarText').textContent = (Math.floor(counter / (time / 1000 / 60))).toString() + "słów na minutę";
                break;
            case ' ':
                document.getElementById('inputBox').value = "";
                break;
            case (firstWord[0]):
                if (textTable.length == 1) {
                    document.getElementById('inputBox').value = "";
                    document.getElementById('wholeText').textContent = "";
                    counter++;
                    document.getElementById('wordsperminute').textContent = "Słowa na minutę: " + Math.floor(counter / (time / 1000 / 60));
                    document.getElementById('success-box').textContent = "Słowa na minutę: " + Math.floor(counter / (time / 1000 / 60));
                    document.getElementById('success-box').hidden = false;
                    document.getElementById('wordsperminute').hidden = true;
                    console.log(Math.floor(counter / (time / 1000 / 60)));
                    $scope.wordsperminute = Math.floor(counter / (time / 1000 / 60));
                    counter = 0;
                    document.getElementById('textEnded').hidden = false;
                    document.getElementById('progressBar').style.width = (Math.floor(counter / textLength * 100)).toString() + "%";
                    
                    $("#trivia").hide().fadeIn(2000);
                    $('#inputBox').hide();
                    $('.progress').hide();
                    handleLastestScoresChange();
                }
                else {
                    if (input == (firstWord[0] + ' ').substring(0, input.length)) document.getElementById('highlight').style.backgroundColor = 'green';
                    else document.getElementById('highlight').style.backgroundColor = 'red';

                    document.getElementById('nohighlight').textContent = (firstWord[0] + ' ').substring(input.length, (firstWord[0] + ' ').length);
                    document.getElementById('highlight').textContent = (firstWord[0] + ' ').substring(0, input.length);
                }
                break;
            default:
                if (input == (firstWord[0] + ' ').substring(0, input.length)) document.getElementById('highlight').style.backgroundColor = 'green';
                else document.getElementById('highlight').style.backgroundColor = 'red';

                document.getElementById('nohighlight').textContent = (firstWord[0] + ' ').substring(input.length, (firstWord[0] + ' ').length);
                document.getElementById('highlight').textContent = (firstWord[0] + ' ').substring(0, input.length);

        }

    });

    function handleLastestScoresChange() {

        var newLatestScores = [{}];

        debugger;

        getNewLatestScores(newLatestScores).then(function() {;


        console.log(newLatestScores);
        for (var i = 0; i < 10; i++) {
            console.log(i);
            console.log(newLatestScores[i]);
            firebase.database().ref('Latest/' + i.toString()).set ({
                user:newLatestScores[i].username,
                text:newLatestScores[i].text,
                speed:newLatestScores[i].result,
                Index:i+1
                })
            
        }
        })
    }

    async function getNewLatestScores(newLatestScores) {
        console.log(firebase.auth().currentUser.isAnonymous);
    for (var i = 9; i >= 0; i--) {
            if (i == 0 && firebase.auth().currentUser.isAnonymous === false) {
                newLatestScores[i] = ({
                    'username': firebase.auth().currentUser.email,
                    'text': document.getElementById('Title').textContent,
                    'result': $scope.wordsperminute
                })
            }
            else if(i == 0 && firebase.auth().currentUser.isAnonymous === true){
                newLatestScores[i] = ({
                    'username': "Anonymous",
                    'text': document.getElementById('Title').textContent,
                    'result': $scope.wordsperminute
                })
            }
            else {
                await firebase.database().ref('Latest/' + (i-1).toString()).once('value').then(function (snapshot) {
                    newLatestScores[snapshot.val().Index] = ({
                    'username': snapshot.val().user,
                    'text': snapshot.val().text,
                    'result': snapshot.val().speed
                })
                })    
            }

        }
    }
}
]);


function initApp($window) {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            if (!user.isAnonymous) {
                if (window.location.hash == '#/register') window.location.hash = '#/';
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
            }
        } else {
            document.getElementById('notLoggedIn').hidden = false;
            document.getElementById('loggedIn').hidden = true;
            document.getElementById('profile').textContent = "";
        }

        document.getElementById('profile').value = "";

        document.getElementById('logout').addEventListener('click', function () { firebase.auth().signOut(); }, false);

        $("#trivia").hide();
    })
};




window.onload = function ($window) {
    initApp($window);
};