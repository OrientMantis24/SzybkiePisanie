angular.module('szybkiePisanie')
    .controller('HomeCtrl', ["$scope", "$rootScope", "$firebaseAuth", "$interval", function ($scope, $rootScope, $firebaseAuth, $interval) {
        $scope.results = [{}];
        var promises = [];

        if(firebase.auth().currentUser === null)promises.push(firebase.auth().signInAnonymously());

        Promise.all(promises).then(function() {
        for (i = 0; i < 10; i++) {
            firebase.database().ref('Latest/' + i.toString()).once('value').then(function (snapshot) {
                $scope.index = snapshot.val().Index;
                $scope.results[$scope.index - 1] = ({
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
                    $scope.index = snapshot.val().Index;


                    $scope.results[$scope.index  - 1] = ({
                        'username': snapshot.val().user.toString(),
                        'text': snapshot.val().text.toString(),
                        'result': snapshot.val().speed.toString()
                    });


                })
            }
        }, 5000);
        })
    }])