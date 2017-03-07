angular.module('szybkiePisanie', ['ngRoute', 'firebase'])
    .config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider
                .when('/home', {
                    templateUrl: 'Home/home.html',
                    controller: 'HomeCtrl'
                })

                .when('/practice', {
                    templateUrl: 'Practice/practice.html',
                    controller: 'PracticeCtrl'
                })

                .when('/signin', {
                    templateUrl: 'SignIn/signin.html',
                    controller: 'SignInCtrl'
                })

                .when('/profile', {
                    templateUrl: 'Profile/profile.html',
                    controller: 'ProfileCtrl'
                })
                
                .when('/register', {
                    templateUrl: 'Register/register.html',
                    controller: 'RegisterCtrl'
                })

                .otherwise({
                    redirectTo: '/home'
                })
        }]);

function initApp($window) {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user && user.isAnonymous === false) {
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