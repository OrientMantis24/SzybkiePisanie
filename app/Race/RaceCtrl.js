angular.module('szybkiePisanie')
    .controller("RaceCtrl", ["$scope", "$firebaseAuth", "$rootScope", function ($scope, $firebaseAuth, $rootScope) {

        var randomRoomNumber = Math.floor((Math.random() * 2000) + 1);

        while(!$rootScope.roomFound){
            randomRoomNumber = Math.floor((Math.random() * 2000) + 1);
            firebase.database().ref('rooms/' + randomRoomNumber).once('value').then(function (snapshot) {
                    if(snapshot.val().roomActive == 0)return;   //Room is not active
                    if(snapshot.val().active[1] == 1 && //No free slots
                    snapshot.val().active[2] == 1 &&
                    snapshot.val().active[3] == 1 &&
                    snapshot.val().active[4] == 1 &&
                    snapshot.val().active[5] == 1)return;

                    $rootScope.roomFound = true;
                    $rootScope.roomNumberFound = randomRoomNumber;

                    for(var i = 1; i < 6; i++)
                    {
                        if(snapshot.val().active[i] == 0)
                        {
                            $rootScope.slotNumber = i;
                            var update = {
                                user: {
                                    i: firebase.auth().currentUser.displayName
                                },

                                score: {
                                    i: 0
                                },

                                active: {
                                    i: 1
                                }

                            }

                            var updates = {};
                            update['/rooms/' + randomRoomNumber] = update;

                            firebase.database().ref().update(updates);
                        }
                    }
                });
                console.log(randomRoomNumber);
        }

    }]);