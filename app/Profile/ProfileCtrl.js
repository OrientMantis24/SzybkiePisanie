angular.module('szybkiePisanie')
    .controller("ProfileCtrl", ["$scope", "$firebaseAuth", function ($scope, $firebaseAuth) {
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
    }]);