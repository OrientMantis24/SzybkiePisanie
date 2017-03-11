angular.module('szybkiePisanie', ['ngRoute', 'firebase'])
    .run(['$rootScope', function($rootScope) {
        $rootScope.navbarRightLogout = "";
        $rootScope.navbarRightProfile = "";
        $rootScope.linkEnabled;
        $rootScope.logoutClick = function() {
            if($rootScope.linkEnabled)window.location = "#register";
            else firebase.auth().signOut();
        }

    firebase.auth().onAuthStateChanged(function (user) {
        debugger;
        if (user && user.isAnonymous === false) {
                $rootScope.navbarRightProfile = user.email;
                $rootScope.navbarRightLogout = "Wyloguj się";
                $rootScope.signInProfile = "#profile";
                $rootScope.linkEnabled = false;
                $rootScope.$apply();

                   
                
        } else {
             $rootScope.navbarRightProfile = "Zaloguj się";
             $rootScope.navbarRightLogout = "Zarejestruj się";
             $rootScope.signInProfile = "#signin";
             $rootScope.linkEnabled = true;
             $rootScope.$apply();
        }
    })

    }])
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