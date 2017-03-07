angular.module('szybkiePisanie')
    .controller("PracticeCtrl", ["$scope", "$firebaseAuth", function ($scope, $firebaseAuth) {
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

            getNewLatestScores(newLatestScores).then(function () {
                console.log(newLatestScores);
                for (var i = 0; i < 10; i++) {
                    console.log(i);
                    console.log(newLatestScores[i]);
                    firebase.database().ref('Latest/' + i.toString()).set({
                        user: newLatestScores[i].username,
                        text: newLatestScores[i].text,
                        speed: newLatestScores[i].result,
                        Index: i + 1
                    })
                }
            })
        };

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
                else if (i == 0 && firebase.auth().currentUser.isAnonymous === true) {
                    newLatestScores[i] = ({
                        'username': "Anonymous",
                        'text': document.getElementById('Title').textContent,
                        'result': $scope.wordsperminute
                    })
                }
                else {
                    await firebase.database().ref('Latest/' + (i - 1).toString()).once('value').then(function (snapshot) {
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
