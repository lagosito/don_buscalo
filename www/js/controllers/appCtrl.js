angular.module('donBuscalo.appCtrl', [])

.controller('AppCtrl', function($scope, $ionicModal, $translate, $timeout, $state, $rootScope, $ionicSideMenuDelegate, $cordovaDevice, $cordovaGoogleAnalytics, $ionicHistory, $localStorage, $ionicViewSwitcher, $ionicLoading, $ionicPopup, $cordovaNetwork, $q) {


    $rootScope.versionDevice = ionic.Platform.version();
    ionic.Platform.ready(function() {
        $rootScope.versionDevice = ionic.Platform.version();
    });
    $rootScope.$watch('$rootScope.versionDevice', function() {
        if ($rootScope.versionDevice === 4.1 || $rootScope.versionDevice === 4.2 || $rootScope.versionDevice === 4.3 && ionic.Platform.isAndroid()) {
            $rootScope.versionClass = 'and41';
        } else {
            $rootScope.versionClass = 'other';
        }
    });
    
    
    $scope.open = function() {
        if ($scope.isClosed === true) {
            $ionicSideMenuDelegate.toggleLeft();
        } else {
            $ionicSideMenuDelegate.toggleLeft();
        }
        
        
    };


    $rootScope.slideWidth = window.innerWidth;
    $scope.deviceWidth = window.innerWidth * 0.83;
    $scope.deviceHeight = window.innerHeight * 0.55;
    $scope.imageHeight = window.innerHeight * 0.325;
    $scope.textRestaurantHeight = window.innerHeight * 0.40;
    $scope.textRestaurantFontSize = $scope.textRestaurantHeight * 0.07;
    $scope.textRestaurantPhoneNumberSize = $scope.textRestaurantHeight * 0.10;
    $scope.buttonRestaurantHeight = window.innerHeight * 0.20;
    if (window.innerHeight > 480) {
        $scope.aboutHeight = window.innerHeight * 0.60;
        $scope.heightLogo = 11.9;
    } else {
        $scope.aboutHeight = window.innerHeight * 0.52;
        $scope.heightLogo = 8;
    }



    $scope.btnSize = window.innerWidth * 0.25;
    $scope.btnFontSize = $scope.btnSize * 0.35;


    $scope.range = new Array(100);
    $ionicModal.fromTemplateUrl('templates/feedback.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.feedbackModal = modal;
    });

    $ionicModal.fromTemplateUrl('templates/questions.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.questionsModal = modal;
    });



    $scope.transEn = false;
    $scope.transEs = true;
    $scope.trans = $translate.use();
    if ($scope.trans == 'en') {
        $scope.transEn = true;
        $scope.transEs = false;
    } else if ($scope.trans == 'es') {
        $scope.transEs = true;
        $scope.transEn = false;
    }

    $scope.closeFeedback = function() {
        _menuAnalytics('menu_screen', 'tap', 'menu_screen--back', 0);
        $scope.feedbackModal.hide();
    };

    $ionicModal.fromTemplateUrl('templates/unete.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.uneteModal = modal;
    });

    $scope.closeUnete = function() {
        _menuAnalytics('menu_screen', 'tap', 'menu_screen--back', 0);
        $scope.uneteModal.hide();
    };
    
    $scope.goRestaurant = function(key) {
        var clickable= '#clickable-rest-' + key;
        var cli = $(clickable);
        cli.css({ opacity: 0.6 });
        $scope.restaurantId = key;
        $state.go('app.restaurant', {
                restaurantId: $scope.restaurantId
            });
       
        $timeout(function() {
        cli.css({ opacity: 1 });
        }, 250);
    };

    $scope.goRestaurants = function() {
        $rootScope.isSearchRestaurants = false;
        $rootScope.isInitRestaurants = false;
        
        $timeout(function() {
            $state.go('app.restaurants');
        }, 0);
    };
    
     $scope.goRestaurantsQuestion = function() {
         ionicLoad();
         $rootScope.isSearchRestaurants = false;
        $rootScope.isInitRestaurants = true;

        $timeout(function() {
            $state.go('app.restaurants');
        }, 0);
    };

    $scope.goSearchRestaurants = function() {
        $rootScope.isSearchRestaurants = true;
                $rootScope.isInitRestaurants = true;
        console.log($rootScope.searchCriteria);
        _menuAnalytics('search_question', 'search', $rootScope.searchCriteria, 0);
        $timeout(function() {
            $state.go('app.restaurants');
        }, 0);
    };

    $scope.goRestaurantsPopover = function() {
        $rootScope.isSearchRestaurants = true;
                $rootScope.isInitRestaurants = true;
        _menuAnalytics('search_question', 'search', $rootScope.searchCriteria, 0);
        $timeout(function() {
            $state.go('app.restaurants');
        }, 0);
    };


    $scope.goLocation = function() {
        if (isInternet()) {
            ionicLoad();
            if ($rootScope.filterRestaurants.length > 0) {
                $rootScope.restaurantsLocation = $rootScope.filterRestaurants;
            } else {
                $rootScope.restaurantsLocation = $rootScope.restaurantsAll;
            }
            _menuAnalytics('search_question', 'open', 'search-questionn-map', 0);
                $state.go('app.location');
        }
    };

    $scope.goLocationRestaurants = function() {
        if (isInternet()) {
            ionicLoad();
            if ($rootScope.isSearchRestaurants) {
                $rootScope.restaurantsLocation = $rootScope.searchRestaurants;
            } else {
                $rootScope.restaurantsLocation = $rootScope.filterRestaurants;
            }
            _menuAnalytics('search_result_screen', 'tap', 'map', 0);
                $state.go('app.location');
        }
    };

    $scope.goLocationFavourites = function() {
        if (isInternet()) {
            ionicLoad();
            $rootScope.restaurantsLocation = [];
            angular.copy($rootScope.favouritesRestaurants, $rootScope.restaurantsLocation);
            _menuAnalytics('favourite_screen', 'tap', 'map', 0);
                $state.go('app.location');
        }
    };

    $scope.goLocationRestaurantDetail = function() {
        if (isInternet()) {
            ionicLoad();
            $rootScope.restaurantsLocation = [];
            var rest = $rootScope.restaurant;
            $rootScope.restaurantsLocation.push(rest);
            _menuAnalytics('individual_result_screen', 'tap', rest.name + '--map', 0);
            $state.go('app.location');
        }
    };
    


    // Open the login modal
    $scope.favorites = function() {
        //$scope.modal.show();
        _menuAnalytics('menu_screen', 'tap', 'menu_screen--favourite', 0);
        $ionicViewSwitcher.nextDirection("forward");
        //  $state.go('app.favorites');
    };

    // Open the login modal
    $scope.language = function() {
        //$scope.modal.show();
        $localStorage.language = undefined;

        _menuAnalytics('menu_screen', 'tap', 'menu_screen--language', 0);
        console.log("menu_analytics");
        //  $state.go('language', {cache: false}); 
    };

    $scope.feedback = function() {
        _menuAnalytics('menu_screen', 'tap', 'menu_screen--feedback', 0);
        console.log("menu_analytics");
        // $state.go('app.feedback');
    };


    // Open the login modal
    $scope.questions = function() {
        //$scope.modal.show();
        $ionicHistory.clearHistory();
        $rootScope.refreshQuestions = true;
        _menuAnalytics('menu_screen', 'tap', 'menu_screen--questions', 0);
        // $state.go('app.questions');
    };

    $scope.about = function() {
        _menuAnalytics('menu_screen', 'tap', 'menu_screen--aboutus', 0);
        // $state.go('app.about');
    };

    $scope.unete = function() {
        _menuAnalytics('menu_screen', 'tap', 'menu_screen--joinus', 0);
        //$state.go('app.unete');
    };

    function _menuAnalytics(category, action, label, value) {
        if (typeof analytics !== 'undefined') {
            $timeout(function() {
                $cordovaGoogleAnalytics.trackEvent(category, action, label, value);
            }, 200);
        }
    }


    function isInternet() {
        if (window.Connection) {
            if (navigator.connection.type == Connection.NONE) {
                $ionicPopup.alert({
                    title: $translate.instant('InternetConnection'),
                    content: $translate.instant('InternetConnectionDescription')
                })
                    .then(function(result) {
                        if (!result) {}
                    });

            } else {
                return true;
            }
        } else {
            return true;
        }
    }
    
    

    function ionicLoad() {

        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
    }
    $rootScope.isInternetCheck = function() {
        if (window.Connection) {
            if (navigator.connection.type == Connection.NONE) {
                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }
    };

})


;