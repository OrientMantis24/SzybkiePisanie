angular.module('szybkiePisanie')
    .controller("PracticeCtrl", ["$scope", "$firebaseAuth", function ($scope, $firebaseAuth) {
        var randomNumber = Math.floor((Math.random() * 2) + 0);
        var start = 0;
        $scope.text;
        $scope.showTrivia = false;
        $scope.textTable;
        $scope.firstWord;
        $scope.firstWordHighlight;
        $scope.firstWordNoHighlight ;
        $scope.latterWords = "";
        $scope.wordsperminute;
        $scope.wordsPerMinuteSuccess = false;
        $scope.textLength;
        $scope.input;
        $scope.trivia = {
            author: "",
            title: "",
            image: "",
            text: ""
        };
        $scope.counter = 0;
        $scope.progressBar = {
            "width": "0%"
        }

        var promises = [];

        if(firebase.auth().currentUser === null)promises.push(firebase.auth().signInAnonymously());

        Promise.all(promises).then(function() {
        getText();
        })
        function getText() {
            firebase.database().ref('Texts/' + randomNumber.toString()).once('value').then(function (snapshot) {
                $scope.text = snapshot.val().Text;
                $scope.textTable = $scope.text.split(' ');
                $scope.textLength = $scope.textTable.length;
                $scope.firstWord = $scope.textTable[0];
                $scope.firstWordNoHighlight = $scope.firstWord + ' ';
                for (var i = 1; i < $scope.textTable.length; i++) {
                    $scope.latterWords += ($scope.textTable[i] + ' ');
                }

                $scope.progressBar.width = "0%";
                $scope.trivia.author = snapshot.val().Author;
                $scope.trivia.title = snapshot.val().Title;
                $scope.trivia.image = snapshot.val().Image;
                $scope.trivia.text = snapshot.val().Trivia;
                $scope.$apply();
            })
        }

        $scope.inputChanged = function () {
            if (start == 0) {
                var date = new Date();
                start = date.getTime();
            }
            var date = new Date();
            var stop = date.getTime();
            var time = stop - start;



            switch ($scope.input) {
                case ($scope.firstWord + ' '):
                    $scope.textTable.shift();
                    $scope.firstWord = $scope.textTable[0];
                    $scope.firstWordHighlight = "";
                    $scope.firstWordNoHighlight = $scope.firstWord;
                    $scope.latterWords = "";
                    $scope.input = "";
                    $scope.counter++;
                    $scope.wordsperminute = Math.floor($scope.counter / (time / 1000 / 60));
                    for (var i = 1; i < $scope.textTable.length; i++) {
                        $scope.latterWords += ($scope.textTable[i] + ' ');
                    }
                    $scope.progressBar.width = (Math.floor($scope.counter / $scope.textLength * 100)).toString() + "%";
                    break;
                case ' ':
                    $scope.input = "";
                    break;
                case ($scope.firstWord):
                    if ($scope.textTable.length == 1) {

                        $scope.input = "";
                        $scope.firstWord = "";
                        $scope.firstWordHighlight = "";
                        $scope.firstWordNoHighlight = "";
                        $scope.counter++;
                        $scope.wordsPerMinuteSuccess = true;
                        $scope.wordsperminute = Math.floor($scope.counter / (time / 1000 / 60));
                        $scope.counter = 0;
                        $scope.progressBar.width = "0%";

                        $scope.showTrivia = true;
                        $("#trivia").fadeIn(2000);
                        $('#inputBox').hide();
                        $('.progress').hide();
                        handleLastestScoresChange();
                    }
                default:
                    if ($scope.input == ($scope.firstWord + ' ').substring(0, $scope.input.length)) document.getElementById('highlight').style.backgroundColor = 'green';
                    else document.getElementById('highlight').style.backgroundColor = 'red';

                    $scope.firstWordNoHighlight = ($scope.firstWord + ' ').substring($scope.input.length, ($scope.firstWord + ' ').length);
                    $scope.firstWordHighlight = ($scope.firstWord + ' ').substring(0, $scope.input.length);

            }

        };

        function handleLastestScoresChange() {
            $scope.newLatestScores = [{}];
            getNewLatestScores().then(function () {
                for (var i = 0; i < 10; i++) {
                    firebase.database().ref('Latest/' + i.toString()).set({
                        user: $scope.newLatestScores[i].username,
                        text: $scope.newLatestScores[i].text,
                        speed: $scope.newLatestScores[i].result,
                        Index: i + 1
                    })
                }
            })
        };

        function getNewLatestScores() {
            var promises = [];
            for (var i = 9; i >= 0; i--) {
                if (i == 0 && firebase.auth().currentUser.isAnonymous === false) {
                    $scope.newLatestScores[i] = ({
                        'username': firebase.auth().currentUser.email,
                        'text': $scope.trivia.title,
                        'result': $scope.wordsperminute
                    })
                }
                else if (i == 0 && firebase.auth().currentUser.isAnonymous === true) {
                    $scope.newLatestScores[i] = ({
                        'username': "Anonymous",
                        'text': $scope.trivia.title,
                        'result': $scope.wordsperminute
                    })
                }
                else {
                    promises.push(firebase.database().ref('Latest/' + (i - 1).toString()).once('value').then(function (snapshot) {
                        $scope.newLatestScores[snapshot.val().Index] = ({
                            'username': snapshot.val().user,
                            'text': snapshot.val().text,
                            'result': snapshot.val().speed
                        })
                    }))
                }

            }
            return Promise.all(promises);
        }
    }
    ]);
