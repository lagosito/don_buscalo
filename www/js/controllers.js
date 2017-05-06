angular.module('donBuscalo.controllers', [])
    .controller('MenuCtrl', function($scope, $window, $cordovaGoogleAnalytics) {
        function _waitForAnalytics() {
            if (typeof analytics !== 'undefined') {
                $timeout(function() {
                    $cordovaGoogleAnalytics.trackView('menu_screen');
                }, 300);
            } else {
                setTimeout(function() {
                    _waitForAnalytics();
                }, 250);
            }
        }
        _waitForAnalytics();
    })

.controller('FeedbackCtrl', function($scope, $ionicHistory, $translate) {

    $scope.sendFeedback = function(key) {
        if (window.plugins && window.plugins.emailComposer) {
            window.plugins.emailComposer.showEmailComposerWithCallback(function(result) {
                    console.log("Response -> " + result);
                },
                $translate.instant('feedback-title-email'), // Subject
                key, // Body
                ["mail@donbuscalo.pe"], // To
                null, // CC
                null, // BCC
                false, // isHTML
                null, // Attachments
                null); // Attachment Data
        }
    };
})




.controller('AboutCtrl', function($scope, $ionicHistory) {

})

.controller('UneteCtrl', function($scope, $ionicHistory, $translate) {
    $scope.sendJoinUs = function(key) {
        if (window.plugins && window.plugins.emailComposer) {
            window.plugins.emailComposer.showEmailComposerWithCallback(function(result) {
                    console.log("Response -> " + result);
                },
                $translate.instant('join-us-title-email'), // Subject
                key, // Body
                ["mail@donbuscalo.pe"], // To
                null, // CC
                null, // BCC
                false, // isHTML
                null, // Attachments
                null); // Attachment Data
        }
    };
})

;