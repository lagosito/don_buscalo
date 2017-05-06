angular.module('donBuscalo.qtoCtrl', [])


.controller('QtoCtrl', function ($scope, $state, $ionicLoading, $timeout, $ionicHistory, $rootScope) {
    
    
    $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
    });
    
     $timeout(function() {
       $state.go('app.questions', {
        });
         
          }, 150);
    
});