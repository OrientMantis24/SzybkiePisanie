angular.module('szybkiePisanie', ['ngRoute', 'firebase', 'ui.bootstrap', 'ngAnimate'])
    .run(['$rootScope', '$location', '$route', function($rootScope, $location, $route) {
        
        $rootScope.$on("$routeChangeSuccess", function(currentRoute, previousRoute){
        $rootScope.title = $route.current.title;
    });
    
    
        $rootScope.roomFound = false;
        $rootScope.roomNumberFound = 0;
        $rootScope.slotNumber = 0;
        $rootScope.navbarRightLogout = "";
        $rootScope.navbarRightProfile = "";
        $rootScope.linkEnabled;
        $rootScope.emailVerified;
        $rootScope.sendVerificationEmail = true;
        $rootScope.verificationEmailSent = false;
        $rootScope.showVerificationStatus = true;
        $rootScope.loggedOutByButton = false;
        $rootScope.isNavCollapsed = true;
        $rootScope.justRegistered = false;
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
                if(!$rootScope.justRegistered)$rootScope.makeAlert("Zalogowano się.", "success");
                else {
                    $rootScope.makeAlert("Zarejestrowano się pomyślnie", "success");
                    $rootScope.justRegistered = false;
                }

                if($location.path() == '/signin' || $location.path() == '/register')$location.path('/home');

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
                $rootScope.makeAlert("Wylogowano się.", "success");
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

    $rootScope.makeAlert = function(text, state) {
        var newElement = angular.element("<div id=\"login-alert\" class=\"alert alert-" + state.toString() + "\" ng-style=\"{'top' : alertBoxPosition}\"><strong>" + text.toString() + "</strong></div>");
        var target = document.getElementById("alertContainer");
        
            angular.element(target).empty();
        angular.element(target).append(newElement);
        $("#login-alert").fadeTo(2000,500).slideUp(500, function(){
            $("#login-alert").slideUp(400);
        })
    }

    }
    ])
    .config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider
                .when('/home', {
                    title: 'Strona Domowa',
                    templateUrl: 'Home/home.html',
                    controller: 'HomeCtrl'
                })

                .when('/practice', {
                    title: 'Trening',
                    templateUrl: 'Practice/practice.html',
                    controller: 'PracticeCtrl'
                })

                .when('/signin', {
                    title: 'Zaloguj się',
                    templateUrl: 'SignIn/signin.html',
                    controller: 'SignInCtrl'
                })

                .when('/profile', {
                    title: 'Profil',
                    templateUrl: 'Profile/profile.html',
                    controller: 'ProfileCtrl'
                })
                
                .when('/register', {
                    title: 'Zarejestruj się',
                    templateUrl: 'Register/register.html',
                    controller: 'RegisterCtrl'
                })
                
                .when('/race', {
                    title: 'Wyścig',
                    templateUrl: 'Race/race.html',
                    controller: 'RaceCtrl'
                })

                .otherwise({
                    redirectTo: '/home'
                })
        }]);