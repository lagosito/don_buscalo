angular.module('donBuscalo.favouritesCtrl', [])

.controller('FavouritesCtrl', function ($scope, $ionicHistory, $localStorage, $timeout, $state, $rootScope, $cordovaGoogleAnalytics, $ionicLoading, $q) {
      
    $scope.isDisabled3 = $scope.isDisabled2 = $scope.isDisabled1 = "";    
    var selectedFilter = 0;
    $scope.goBack = function () {
        _analyticsTrackEvent('favourite_screen', 'tap', 'favourite_screen--back', 0);
        $ionicHistory.goBack();
    };
    
    $timeout(function () {
        restaurantsOperation();
    });
    
    if(typeof analytics !== 'undefined'){
        $timeout(function(){
        $cordovaGoogleAnalytics.trackView('favourite_screen');
        }, 300);
    }
    
        $scope.priceRange = function(range) {
     
    if(range === 1) {
        if(selectedFilter === 1) {
        $scope.myFilter = "";
        $scope.isDisabled3 = "";
        $scope.isDisabled2 = "";   
        $scope.isDisabled1 = "";
        selectedFilter = 0;
        } else {
        $scope.isDisabled3 = "dolar3opacity";
        $scope.isDisabled2 = "dolar2opacity";
        $scope.isDisabled1 = "";
        $scope.myFilter = {priceRange: 1};
        selectedFilter = 1;
        }
        
    } else if(range === 2) {
        if(selectedFilter === 2) {
        $scope.isDisabled3 = "";
        $scope.isDisabled1 = "";
        $scope.isDisabled2 = "";
        $scope.myFilter = "";
        selectedFilter = 0;
        } else {
        $scope.isDisabled3 = "dolar3opacity"; 
        $scope.isDisabled1 = "dolar1opacity";
        $scope.isDisabled2 = "";
         $scope.myFilter = {priceRange: 2};
        selectedFilter = 2;
        }
    } else if(range === 3) {
         if(selectedFilter === 3) {
        $scope.isDisabled2 = ""; 
        $scope.isDisabled1 = "";
        $scope.isDisabled3 = "";
         $scope.myFilter = "";
        selectedFilter = 0;
        } else {
        $scope.isDisabled2 = "dolar2opacity"; 
        $scope.isDisabled1 = "dolar1opacity";
        $scope.isDisabled3 = "";
        $scope.myFilter = {priceRange: 3};
        selectedFilter = 3;
        }
        
    }
    $timeout(function(){
     var rangeFilter = 'filter_price--' +range;
     _analyticsTrackEvent('search_result_screen', 'tap', rangeFilter, 0);
            }, 300); 
    };

    $scope.goRestaurant = function (key) {
        _analyticsTrackEvent('favourite_screen', 'tap', 'favourite_screen--restaurant', 0);
       $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
    });
        $scope.restaurantId = key;
        $ionicHistory.nextViewOptions({
  disableBack: false
});
        $state.go('app.restaurant', {
            restaurantId: $scope.restaurantId
        });
        
    };
    
    function restaurantsOperation() {
        $rootScope.favouritesRestaurants = $localStorage.favouritesRestaurants;
            
        
            $scope.oddRestaurants = [];
            $scope.evenRestaurants = [];

            for (var i = 0; i < $rootScope.favouritesRestaurants.length; i++) {
                (i % 2 === 0 ? $scope.evenRestaurants :      $scope.oddRestaurants).push($rootScope.favouritesRestaurants[i]);
            }
            $rootScope.favouritesRestaurants = $scope.evenRestaurants.concat($scope.oddRestaurants);
    }
    
    function _analyticsTrackEvent(category, action, label, value){
        if(typeof analytics !== 'undefined'){
         $timeout(function() {
                      $cordovaGoogleAnalytics.trackEvent(category, action, label, value);
         }, 200); 
        }
    }

})


;