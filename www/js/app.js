// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'donBuscalo' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'donBuscalo.controllers' is found in controllers.js
angular.module('donBuscalo',
    [
        'ionic','ionic.service.core',
        'pascalprecht.translate',
        'donBuscalo.controllers',
        'donBuscalo.services',
        'donBuscalo.directives',
        'ngCordova',
        'donBuscalo.appCtrl',
        'donBuscalo.languageCtrl',
        'donBuscalo.questionsCtrl',
        'donBuscalo.restaurantCtrl',
        'donBuscalo.sharingCtrl',
        'donBuscalo.qtoCtrl',
        'donBuscalo.restaurantsCtrl',
        'donBuscalo.locationCtrl',
        'donBuscalo.favouritesCtrl',
        'ngMap',
        'ngStorage',
        'ImgCache',
        'pasvaz.bindonce',
        'angular-imgcache',
        'ionic-ratings'
    ])
    .value('ParseConfiguration', {
        applicationId: "GcoMAqZyIDm1H8ARkBq7PZpDtF0sg7svPDG2Dk4n",
        javascriptKey: "D0KfRVUMNLjP6kyDKp8MOqwFJybieuzycFQa3o2C"
    })
    .constant('WUNDERGROUND_API_KEY', '1cc2d3de40fa5af0')
    .constant('FORECASTIO_KEY', '4cd3c5673825a361eb5ce108103ee84a')
    .run(
    function (
        $ionicPlatform,
        $timeout,
        $rootScope,
        $state,
        $localStorage,
        $cordovaGoogleAnalytics,
        $cordovaSplashscreen,
        ImgCache,
        $ionicSideMenuDelegate,
        $ionicHistory,
        $ionicLoading,
        $q,
        $window,
        $document) {


        if ($localStorage.language === undefined) {
        } else {
            event.preventDefault();
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
            $state.go('app.questions');
        }


        $ionicPlatform.ready(function () {
            function loadScript($document, callback, success) {
                var scriptTag = $document.createElement('script');
                scriptTag.id = "google-map-script";
                scriptTag.type = "text/javascript";
                scriptTag.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyB16sGmIekuGIvYOfNoW9T44377IU2d2Es&libraries=geometry&sensor=true&callback=mapReady';
                $document.getElementsByTagName('body')[0].appendChild(scriptTag);
            }

            if (typeof google === 'object' && typeof google.maps === 'object') {
            } else {
                var deferred = $q.defer();
                loadScript($document[0]);

                $window.mapReady = (function (deferred) {
                    return function () {
                        deferred.resolve(google);
                        delete $window.mapReady;
                    };
                })(deferred);
            }

            document.addEventListener("online", function () {


            }, false);

            $timeout(function () {

                if(navigator.splashscreen!=undefined)$cordovaSplashscreen.hide();
                if(navigator.splashscreen!=undefined)navigator.splashscreen.hide();
            }, 1000);

            function _waitForAnalytics() {
                if (typeof analytics !== 'undefined') {
                    $cordovaGoogleAnalytics.debugMode();
                    $cordovaGoogleAnalytics.startTrackerWithId('UA-62748991-2');
                } else {
                    setTimeout(function () {
                        _waitForAnalytics();
                    }, 250);
                }
            }

            _waitForAnalytics();

            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.hide();
                cordova.exec(null, null, 'StatusBar', 'hide', ['Ehi', 'You']);
            }

            ImgCache.$init();
        });


    })


    .config(function ($stateProvider, $urlRouterProvider, $translateProvider, ImgCacheProvider) {

        // set single options
        ImgCacheProvider.setOption('debug', false);
        ImgCacheProvider.setOption('usePersistentCache', true);


        // ImgCache library is initialized automatically,
        // but set this option if you are using platform like Ionic -
        // in this case we need init imgcache.js manually after device is ready
        ImgCacheProvider.manualInit = true;

        $translateProvider.useStaticFilesLoader({
            prefix: '',
            suffix: '.json'
        });
        $translateProvider.preferredLanguage("en");
        $translateProvider.fallbackLanguage("en");

        $stateProvider

            .state('language', {
                cache: false,
                url: "/language",
                templateUrl: 'templates/language.html',
                controller: 'LanguageCtrl'
            })


            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/menu.html",
                controller: 'AppCtrl'
            })

            .state('fav', {
                url: "/fav",
                abstract: true,
                templateUrl: "templates/menu.html",
                controller: 'AppCtrl'
            })
            .state('app.questions', {
                url: "/questions",
                views: {
                    'menuContent': {
                        templateUrl: "templates/questions.html",
                        controller: 'QuestionsCtrl'
                    }
                }
            })

            .state('app.qto', {
                cache: false,
                url: "/qto",
                views: {
                    'menuContent': {
                        templateUrl: "templates/qto.html",
                        controller: 'QtoCtrl'
                    }
                }
            })

            .state('app.questions2', {
                cache: false,
                url: "/questions2",
                views: {
                    'menuContent': {
                        templateUrl: "templates/questions.html",
                        controller: 'QuestionsCtrl'
                    }
                }
            })


            .state('app.feedback', {
                cache: false,
                url: "/feedback",
                views: {
                    'menuContent': {
                        templateUrl: "templates/feedback.html",
                        controller: 'FeedbackCtrl'
                    }
                }
            })

            .state('app.favorites', {
                cache: false,
                url: "/favorites",
                views: {
                    'menuContent': {
                        templateUrl: "templates/favorites.html",
                        controller: 'FavouritesCtrl'
                    }
                }
            })


            .state('app.location', {
                url: "/location",
                views: {
                    'menuContent': {
                        templateUrl: "templates/location.html",
                        controller: 'LocationCtrl'
                    }
                }
            })

            .state('restaurants', {
                url: "/restaurants",
                templateUrl: "templates/restaurants.html",
                controller: 'RestaurantsCtrl'
            })

            .state('app.restaurants', {
                url: "/restaurants",
                views: {
                    'menuContent': {
                        templateUrl: "templates/restaurants.html",
                        controller: 'RestaurantsCtrl'
                    }
                }
            })

            .state('app.about', {
                cache: false,
                url: "/about",
                views: {
                    'menuContent': {
                        templateUrl: "templates/about.html",
                        controller: 'AboutCtrl'
                    }
                }
            })

            .state('app.about-es', {
                cache: false,
                url: "/about-es",
                views: {
                    'menuContent': {
                        templateUrl: "templates/about-es.html",
                        controller: 'AboutCtrl'
                    }
                }
            })

            .state('app.unete', {
                cache: false,
                url: "/unete",
                views: {
                    'menuContent': {
                        templateUrl: "templates/unete.html",
                        controller: 'UneteCtrl'
                    }
                }
            })


            .state('app.search', {
                url: "/search",
                views: {
                    'menuContent': {
                        templateUrl: "templates/search.html"
                    }
                }
            })

            .state('app.browse', {
                url: "/browse",
                views: {
                    'menuContent': {
                        templateUrl: "templates/browse.html"
                    }
                }
            })


            .state('app.restaurant', {
                cache: false,
                url: "/restaurant/:restaurantId",
                views: {
                    'menuContent': {
                        templateUrl: "templates/restaurant.html",
                        controller: 'RestaurantCtrl'
                    }
                }
            })


        ;
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('language');
    })


;