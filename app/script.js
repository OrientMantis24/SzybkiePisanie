angular.module('szybkiePisanie', ['ngRoute', 'firebase', 'ui.bootstrap', 'ngAnimate'])
    .run(['$rootScope', '$location' , function($rootScope, $location) {
        $rootScope.navbarRightLogout = "";
        $rootScope.navbarRightProfile = "";
        $rootScope.linkEnabled;
        $rootScope.emailVerified;
        $rootScope.sendVerificationEmail = true;
        $rootScope.verificationEmailSent = false;
        $rootScope.showVerificationStatus = true;
        $rootScope.loggedOutByButton = false;
        $rootScope.isNavCollapsed = true;
        $rootScope.alertBoxPosition = (document.getElementById('navbar').getBoundingClientRect().top + document.getElementById('navbar').style.height + 20).toString() + "px";
        $rootScope.logoutClick = function() {
            if($rootScope.linkEnabled)window.location = "#register";
            else {
                $rootScope.loggedOutByButton = true;
                firebase.auth().signOut();
            }
        }

    firebase.auth().onAuthStateChanged(function (user) {
        if (user && user.isAnonymous === false) {
                $rootScope.navbarRightProfile = user.email;
                $rootScope.navbarRightLogout = "Wyloguj się";
                $rootScope.signInProfile = "#profile";
                $rootScope.linkEnabled = false;
                $rootScope.email = user.email;
                $rootScope.makeAlert("Zalogowano się.");

                if($location.path() == '/signin')$location.path('/home');

                if(user.emailVerified) {
                    $rootScope.emailVerified  = true;
                    $rootScope.sendVerificationEmail = false;
                    $rootScope.verificationEmailSent = false;
                    $rootScope.showVerificationStatus = true;
                }
                else {
                    $rootScope.emailVerified = false;
                    $rootScope.sendVerificationEmail = true;
                    $rootScope.verificationEmailSent = false;
                    $rootScope.showVerificationStatus = true;
                }

                $rootScope.$apply();

                   
                
        } else {
            if($rootScope.loggedOutByButton){
                $rootScope.makeAlert("Wylogowano się.");
                $rootScope.loggedOutByButton = false;
            }
             if($location.path() == '/profile')$location.path('/home');
             $rootScope.navbarRightProfile = "Zaloguj się";
             $rootScope.navbarRightLogout = "Zarejestruj się";
             $rootScope.signInProfile = "#signin";
             $rootScope.linkEnabled = true;
             $rootScope.$apply();
        }

    })

    $rootScope.makeAlert = function(text) {
        var newElement = angular.element("<div id=\"login-alert\" class=\"alert alert-success\" ng-style=\"{'top' : alertBoxPosition}\"><strong>" + text + "</strong></div>");
                var target = document.getElementById("alertContainer");
                angular.element(target).append(newElement);
                $("#login-alert").fadeTo(2000,500).slideUp(500, function(){
                    $("#login-alert").slideUp(400);
                    angular.element(target).empty();
                })
    }

    }
    ])
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