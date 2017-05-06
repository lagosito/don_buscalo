angular.module('donBuscalo.sharingCtrl', [])


.controller('SharingCtrl', function ($scope, Restaurants, RestaurantsImages, $timeout, $stateParams, $ionicHistory, $state, $ionicSlideBoxDelegate, $localStorage, $filter, LocationOperations, $cordovaGoogleAnalytics, $ionicLoading, $rootScope, $ionicScrollDelegate, $ionicModal, $cordovaSocialSharing) {
    
    var link = "http://www.studiotigres.com/";
    var logoImage = "../img/logo.png";
    
    $scope.showAlertFailed = function() {
     var alertPopup = $ionicPopup.alert({
       title: 'Sharing failed.',
       template: 'Sorry but we cannot share via' + name
     });
     alertPopup.then(function(res) {
     });
     };
    
    $scope.showAlertSuccess = function() {
     var alertPopup = $ionicPopup.alert({
       title: 'Success',
       template: 'Thanks for sharing!'
     });
     alertPopup.then(function(res) {
     });
     };
    
    
    $scope.btnSharingTwitter = function (message) {
        $cordovaSocialSharing.canShareVia("twitter", message, logoImage, link).then(function(result) {
            $cordovaSocialSharing.shareViaTwitter(message, logoImage, link);
            $scope.modal.hide();
            $scope.showAlertSuccess();
            
        }, function(error) {
            $scope.modal.hide();
            $scope.showAlertFailed();
            
        });
    };
    
    $scope.btnSharingFacebook = function (message) {
        $cordovaSocialSharing.canShareVia("facebook", message, image, link).then(function(result) {
            $cordovaSocialSharing.shareViaTwitter(message, image, link);
            $scope.modal.hide(); 
            $scope.showAlertSuccess();
            
        }, function(error) {
              $scope.modal.hide();
            alert("Cannot share on Facebookr");
          
        });
    };
        



});