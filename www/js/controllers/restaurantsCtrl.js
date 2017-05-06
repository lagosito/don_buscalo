angular.module('donBuscalo.restaurantsCtrl', [])


.controller('RestaurantsCtrl', function($scope, $timeout, $state, $rootScope, $cordovaGoogleAnalytics, $ionicLoading, $ionicScrollDelegate, $filter) {

    $scope.isDisabled3 = $scope.isDisabled2 = $scope.isDisabled1 = "";
    var selectedFilter = 0;
    $scope.moreDataCanBeLoaded = true;
    if (typeof analytics !== 'undefined') {
        $timeout(function() {
            $cordovaGoogleAnalytics.trackView('search_result_screen');
        }, 400);
    }

    $scope.prevRestaurants = 0;
    $scope.oddRestaurants = [];
    $scope.evenRestaurants = [];
    $scope.fromIndex = 0;
    $scope.toIndex = 0;
    $scope.GotoAds = function(link) {
        window.open(link, '_system', 'location=yes');
    };
    
    
    $scope.ratingsObject = {
        iconOn: 'fa fa-star',    //Optional
        iconOff: 'fa fa-star-o',   //Optional
        iconOnColor: 'RGB(255, 255, 255)',  //Optional
        iconOffColor:  'RGBA(255, 255, 255, 0)',    //Optional
        rating:  4, //Optional
        readOnly: true, //Optional
        callback: function(rating) {    //Mandatory
        }
    };

    
    
    var addLimiter = 9;
    $scope.priceRange = function(range) {

        if (range === 1) {
            if (selectedFilter === 1) {
                $scope.myFilter = "";
                $scope.isDisabled3 = "";
                $scope.isDisabled2 = "";
                $scope.isDisabled1 = "";
                selectedFilter = 0;
            } else {
                $scope.isDisabled3 = "dolar3opacity";
                $scope.isDisabled2 = "dolar2opacity";
                $scope.isDisabled1 = "";
                $scope.myFilter = {
                    priceRange: 1
                };
                selectedFilter = 1;
            }

        } else if (range === 2) {
            if (selectedFilter === 2) {
                $scope.isDisabled3 = "";
                $scope.isDisabled1 = "";
                $scope.isDisabled2 = "";
                $scope.myFilter = "";
                selectedFilter = 0;
            } else {
                $scope.isDisabled3 = "dolar3opacity";
                $scope.isDisabled1 = "dolar1opacity";
                $scope.isDisabled2 = "";
                $scope.myFilter = {
                    priceRange: 2
                };
                selectedFilter = 2;
            }
        } else if (range === 3) {
            if (selectedFilter === 3) {
                $scope.isDisabled2 = "";
                $scope.isDisabled1 = "";
                $scope.isDisabled3 = "";
                $scope.myFilter = "";
                selectedFilter = 0;
            } else {
                $scope.isDisabled2 = "dolar2opacity";
                $scope.isDisabled1 = "dolar1opacity";
                $scope.isDisabled3 = "";
                $scope.myFilter = {
                    priceRange: 3
                };
                selectedFilter = 3;
            }

        }
        $ionicScrollDelegate.scrollTop();
        $timeout(function() {
            var rangeFilter = 'filter_price--' + range;
            _analyticsTrackEvent('search_result_screen', 'tap', rangeFilter, 0);
        }, 300);
    };
    $scope.libraryLoading = false;
    $scope.refreshedTop = 0;

    $scope.advertising100 = {
        name: "advertising-100"
    };
    $scope.advertising50 = {
        name: "advertising-50"
    };

    $scope.loadMore = function() {
        if($scope.toIndex > 8) {
        //$scope.restaurants.push.apply($scope.restaurants, restAll.slice($scope.toIndex, $scope.toIndex + 10));
        $scope.oddRestaurants.push.apply($scope.oddRestaurants, oddRestaurantsAll.slice($scope.toIndex, $scope.toIndex + 10));
        $scope.evenRestaurants.push.apply($scope.evenRestaurants, evenRestaurantsAll.slice($scope.toIndex, $scope.toIndex + 10));
        $scope.toIndex += 10;
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
    };


    $scope.$on('$stateChangeSuccess', function() {
        $scope.loadMore();
    });

    $scope.onSwipePrevious = function() {
        $scope.goBack();
    };

    $scope.goQuestions = function() {
        $ionicLoading.show({ content: 'Loading',  animation: 'fade-in', showBackdrop: true,  maxWidth: 200,  showDelay: 0});
        $rootScope.refreshQuestions = true;
        $state.go('app.questions');
        _analyticsTrackEvent('search_result_screen', 'tap', 'back', 0);
    };


    $scope.goBack = function() {
        console.log("foo")
        _analyticsTrackEvent('search_result_screen', 'tap', 'back', 0);
        $rootScope.notRefreshQuestion = true;
        $state.go('app.questions');
    };
    $scope.restaurants = [];
    var restAll =[];
    var oddRestaurantsAll = [];
    var evenRestaurantsAll = [];
    $scope.$on('$ionicView.enter', function() {
        // Any thing you can think of
        $scope.isDisabled3 = $scope.isDisabled2 = $scope.isDisabled1 = "";
        selectedFilter = 0;
        $scope.myFilter = "";
        $timeout(function() {
            if ($rootScope.isInitRestaurants) {
                restAll =[];
                oddRestaurantsAll = []; 
                evenRestaurantsAll = [];
                $scope.oddRestaurants = [];
                $scope.evenRestaurants = [];
                $rootScope.isInitRestaurants = false;
            if ($rootScope.isSearchRestaurants) {
                   restAll = $filter('orderBy')($rootScope.searchRestaurants, "mts");
            } else {
                    restAll = $filter('orderBy')($rootScope.filterRestaurants, "mts");
                   
            }
                
                // $scope.restaurants = restAll.slice(0, $scope.toIndex);
                if (restAll.length > 0) {
                    $scope.addAdvertising();
                    oddEvenRestaurantsCalculate(restAll);
                } else {
                $ionicLoading.hide();
                }
                
            } else {
            $ionicLoading.hide();
            }
        });
    });
    
    $scope.addAdvertising = function() {
        var restLength = restAll.length;
        angular.forEach($rootScope.advertisments, function (ad, index) {
            if(ad.order < restLength) {
            ad.name = 'advertising50';
            ad.mts = restAll[ad.order-1].mts;
            restAll.splice(ad.order, 0, ad);
            }
        });
        
    };

    

    function _analyticsTrackEvent(category, action, label, value) {
        if (typeof analytics !== 'undefined') {
            $timeout(function() {
                $cordovaGoogleAnalytics.trackEvent(category, action, label, value);
            }, 100);
        }
    }

    function oddEvenRestaurantsCalculate(restaurants) {
        for (var i = 0; i < restaurants.length; i++) {
            (i % 2 === 0 ? $scope.evenRestaurants : $scope.oddRestaurants).push(restaurants[i]);
        }
        oddRestaurantsAll = $filter('orderBy')($scope.oddRestaurants, "mts");
        evenRestaurantsAll = $filter('orderBy')($scope.evenRestaurants, "mts");
        $scope.oddRestaurants = oddRestaurantsAll.slice(0, 9);
        $scope.evenRestaurants = evenRestaurantsAll.slice(0, 9);
        $scope.restaurants = undefined;
        restAll = undefined;
        $scope.toIndex = 9;
        $ionicLoading.hide();
    }
    

})

;