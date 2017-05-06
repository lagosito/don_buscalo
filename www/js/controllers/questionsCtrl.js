angular.module('donBuscalo.questionsCtrl', [])


.controller('QuestionsCtrl',
    function($scope, Questions, $timeout, $translate, $rootScope, Weather, Geo, orderByFilter, $filter, Restaurants, LocationOperations, $cordovaGoogleAnalytics, $ionicLoading, $ionicPopover, ImgCacheImages, $ionicHistory, $state, $ionicPopup, $localStorage, $ionicPlatform, $ionicSideMenuDelegate, $q, Ads, $window, $document, $cordovaGeolocation) {
        var _this = this;
        var downloadDataCache = true;
        var downloadData = true;
        var refreshDataCounting = 0;

        $translate.use($localStorage.language);
        if ($localStorage.language == 'en') {
            $scope.trEn = true;
        } else {
            $scope.trEn = false;
        }
        /*if ($localStorage.tutorial === undefined) {
            $scope.tutorialVisible = true;
            if ($localStorage.language == 'en') {
                $scope.languageTutorialImage = 'img/tutorialEn.jpg';
            } else if ($localStorage.language == 'es') {
                $scope.languageTutorialImage = 'img/tutorialEs.png';
            }
        } else {
            $scope.tutorialVisible = false;
        }*/

        var deregister = $ionicPlatform.registerBackButtonAction(function(e) {
            if ($ionicHistory.currentStateName() == "app.location" || $ionicHistory.currentStateName() == "app.restaurant" || $ionicHistory.currentStateName() == "app.restaurants") {
                if ($ionicHistory.backView().stateName == 'app.questions') {
                    $rootScope.notRefreshQuestion = true;
                }
                $ionicHistory.goBack();
                // or do nothing
            } else if ($ionicHistory.currentStateName() == "app.questions") {
                e.preventDefault();

            } else if ($ionicHistory.currentStateName() == "language") {
                e.preventDefault();
                navigator.app.backHistory();
            } else {
                e.preventDefault();
                navigator.app.backHistory();
            }
            return false;
        }, 101);
        $scope.$on('$destroy', deregister);

        $scope.tutorialClicked = function() {
            var confirmPopup = $ionicPopup.confirm({
                title: $translate.instant('tut-title'),
                template: $translate.instant('tut-description'),
                buttons: [{
                    text: $translate.instant('no')
                }, {
                    text: $translate.instant('yes'),
                    onTap: function() {
                        $scope.tutorialVisible = false;
                        $localStorage.tutorial = false;
                    }
                }]
            });
            confirmPopup.then(function(res) {
                if (res) {
                    $scope.tutorialVisible = false;
                    $localStorage.tutorial = false;
                } else {}
            });
        };


        /* FUNCTIONS */

        var containsText = function(search) {
            var gotText = false;
            for (var i in $rootScope.restaurantsAll) {
                var re = new RegExp(search, "ig");
                var s = re.test($rootScope.restaurantsAll[i].name);
                var e = re.test($rootScope.restaurantsAll[i].address);
                var t = re.test($rootScope.restaurantsAll[i].typeOfFoodRestaurant);
                var th = re.test($rootScope.restaurantsAll[i].typeOfFoodRestaurantEsp);
                if (s || e || t || th) {
                    var dict = {
                        "name": $rootScope.restaurantsAll[i].name,
                        "objectId": $rootScope.restaurantsAll[i].objectId
                    };
                    $rootScope.itemsArr.push(dict);
                    $rootScope.searchRestaurants.push($rootScope.restaurantsAll[i]);
                    gotText = true;
                }

            }
            return gotText;
        };

        $scope.searchFocus = function() {
            _analyticsTrackEvent('search_question', 'open', '', 0);
            _analyticsTrackEvent('search_question', 'focus', '', 0);
        };
        $scope.disableFocus = function() {
            _analyticsTrackEvent('search_question', 'blur', $rootScope.searchCriteria, 0);
            _analyticsTrackEvent('search_question', 'close', '', 0);
            $scope.popover.hide();

        };
        $scope.searchRestaurant = function() {
            if ($scope.itemsArr.length > 1) {
                $scope.goSearchRestaurants();
            }
            $rootScope.itemsArr = [];
        };

        $scope.searchMe = function(search, $event) {
            $rootScope.itemsArr = [];
            $rootScope.searchRestaurants = [];
            $rootScope.itemsDisplaPanel = false;
            $rootScope.searchCriteria = search;
            if (search.length > 2) {
                var foundText = containsText(search);
                $scope.itemsDisplaPanel = (foundText) ? true : false;
                if ($scope.itemsDisplaPanel) {
                    $scope.popover.show(angular.element(document.querySelector('hr.menu-hr')));
                } else {
                    $scope.popover.hide();
                }
            } else {
                $scope.popover.hide();
            }
        };


        function _waitForAnalytics() {
            if (typeof analytics !== 'undefined') {
                $timeout(function() {
                    $cordovaGoogleAnalytics.trackView('search_question');
                }, 300);
            } else {
                setTimeout(function() {
                    _waitForAnalytics();
                }, 250);
            }
        }

        function _calculateRestaurants() {
            $timeout(function() {
            for (var i = 0; i < $rootScope.restaurantsAll.length; i++) {
                var restLocation = new google.maps.LatLng($rootScope.restaurantsAll[i].latitude, $rootScope.restaurantsAll[i].longitude);
                if ($rootScope.myLocation !== undefined) {
                    $rootScope.restaurantsAll[i].mts = LocationOperations.calcDistance($rootScope.myLocation, restLocation);
                }
            }

            $rootScope.restaurantsAll = $filter('orderBy')($rootScope.restaurantsAll, "mts");
            $localStorage.rests = btoa(unescape(encodeURIComponent(JSON.stringify($rootScope.restaurantsAll))));
           
            if (downloadDataCache) {



                ImgCacheImages.cacheAll();
                
                downloadData = false;
                downloadDataCache = false;
                $rootScope.afterLanguage = false;
            }
             }, 0);    
            
        }

        $scope.generateSelect = function() {


            setTimeout(function() {
                function init() {

                    $('#question_select').mobiscroll().select({
                        theme: theme,
                        mode: mode,
                        display: display,
                        lang: lang,
                        onSelect:function(){
                            $scope.btnClick("yes");
                        }
                    });

                }

                var demo, theme, mode, display, lang;



                $('#settings').on('change', function() {
                    demo = "select";
                    theme = "ios";
                    mode = "scroller";
                    display = "inline";
                    lang = "en";
                    init();
                });

                $('.question-select').trigger('change');

                $scope.$apply(); //this triggers a $digest
            }, 0);
        };



        $scope.goRestaurantWithBackQuestion = function() {
            $scope.index = $scope.index - 1;
            $scope.quest = $scope.questions[$scope.index];
            delete $scope.answersChoosen[$scope.quest.filter];
            $scope.goRestaurantsQuestion();
        };
        $scope.opacityButtons = 1;
        $scope.btnClick = function(key) {
                if ($scope.opacityButtons === 1) {
                    loadingQuestionSelect = true;
                    $scope.animate = "fadeOutLeftBig animated";
                    $scope.animateButtons = "animated";
                    $scope.opacityButtons = 0;

                    $timeout(function() {
                        $scope.index = $scope.index + 1;
                        $scope.hideHello = "Yes";
                        if ($scope.quest.hasAnswer) {
                            $scope.selectedQuestValue = $('.mbsc-ios.dw-inline.dw-nobtn.dw-select').find('.dw-li.dw-v.dw-sel')[0].textContent;
                            $scope.selectedQuestIndex = $('.mbsc-ios.dw-inline.dw-nobtn.dw-select').find('.dw-li.dw-v.dw-sel').data().val;
                            $rootScope.answersChoosen[$scope.quest.filter] = $scope.quest.Answer.namesEn[$scope.selectedQuestIndex];
                        } else {
                            $rootScope.answersChoosen[$scope.quest.filter] = JSON.parse(key);
                        }
                        var questionLabel = 'question--' + $scope.quest.objectId;
                        _analyticsTrackEvent('search_question', 'tap', questionLabel, 0);
                        if ($scope.index < $scope.questions.length) {
                            var goRestaurant = $scope.restaurantsCounting();
                            if (!goRestaurant) {
                                $scope.sentenceCreation(key);
                                //$scope.randomBg = $scope.backgrounds[$scope.index];
                                $scope.quest = $scope.questions[$scope.index];
                                $scope.generateSelect();

                                if ($scope.quest.hasAnswer) {
                                    $scope.colSize = "col-20";
                                    $("yes-no").hide();
                                } else {
                                    $scope.colSize = "col-50";
                                    $("yes-no").show();

                                }

                            } else {
                                $scope.goRestaurantWithBackQuestion();
                            }


                        } else {
                            //$scope.restaurantsCounting();
                            $scope.goRestaurantWithBackQuestion();
                        }

                        $scope.animate = "";

                    }, 250);
                    $timeout(function() {
                        $scope.opacityButtons = 1;
                        loadingQuestionSelect = false;
                    }, 350);
                }
        };

        $scope.goPlaces = function() {
            if ($scope.quest.order == 1) {
                $rootScope.filterRestaurants = $rootScope.restaurantsAll;
            }
            $scope.goRestaurantsQuestion();
        };

        function locationPopup() {
            $ionicPopup.alert({
                title: $translate.instant('locationAlertTitle'),
                content: $translate.instant('locationAlertDescription')
            })
                .then(function(result) {
                    if (!result) {}
                });
            showedLocationAlert = true;
        }

        $scope.onSwipeLeft = function() {

            $scope.animate = "fadeOutLeftBig animated";
            $scope.animateButtons = "animated";
            $scope.opacityButtons = 0;
            loadingQuestionSelect = true;
            $timeout(function() {
                if ($scope.quest.order == 1) {
                    $rootScope.filterRestaurants = $rootScope.restaurantsAll;
                }
                $scope.hideHello = "Yes";
                $scope.index = $scope.index + 1;
                $scope.answersAll[$scope.index] = "";
                if ($scope.index < $scope.questions.length) {
                    $scope.quest = $scope.questions[$scope.index];
                    $scope.generateSelect();

                    if ($scope.quest.hasAnswer) {
                        $scope.colSize = "col-20";
                        $("yes-no").hide();

                    } else {
                        $scope.colSize = "col-50";
                        $("yes-no").show();

                    }
                } else {
                    $scope.index = $scope.index - 1;
                    $scope.quest = $scope.questions[$scope.index];
                    delete $scope.answersChoosen[$scope.quest.filter];
                    $scope.goRestaurantsQuestion();
                }

                $scope.animate = "";

            }, 300);
            $timeout(function() {
                $scope.opacityButtons = 1;
                loadingQuestionSelect = false;
            }, 350);
        };

        $scope.onSwipeRight = function() {

            if ($scope.index > 0 && $scope.quest.order > 1) {
                loadingQuestionSelect = true;
                $scope.animate = "fadeOutRightBig bounceOut animated";
                $scope.opacityButtons = 0;
                $scope.index = $scope.index - 1;
                $scope.answerUsed2 = $scope.answersAll[$scope.index];
                var incr = 2;
                while (incr < 6 && ($scope.answerUsed2 === "" || $scope.answerUsed2 === undefined)) {
                    $scope.answerUsed2 = $scope.answersAll[$scope.index + 1 - incr];
                    incr++;
                }

                $timeout(function() {
                    $scope.hideHello = "Yes";
                    if ($scope.index < $scope.questions.length) {
                        $scope.quest = $scope.questions[$scope.index];
                        delete $scope.answersChoosen[$scope.quest.filter];
                        $scope.restaurantsCounting();
                        $scope.generateSelect();

                        if ($scope.quest.hasAnswer) {
                            $scope.colSize = "col-20";
                            $(".yes-no").hide();

                        } else {
                            $scope.colSize = "col-50";
                            $(".yes-no").show();

                        }
                    }
                    $scope.animate = "";

                }, 300);
                $timeout(function() {
                    $scope.opacityButtons = 1;
                    loadingQuestionSelect = false;
                }, 350);

            }


        };

        this.getCurrent = function(lat, lng, key, locString) {
            console.log("error google 8");
            Weather.getAtLocation(lat, lng, key).then(function(resp) {
                $scope.current = resp.data;
                console.log('GOT CURRENT', $scope.current);
                $scope.currentWeather = $scope.current.currently.summary;
                $scope.date = new Date($scope.current.currently.time * 1000);
                // hours part from the timestamp
                $scope.hours = $scope.date.getHours();
                $scope.hideHello = "yes";
                if ($scope.hours >= 6 && $scope.hours <= 12) {
                    $scope.helloMessage = $translate.instant('goodMorning');
                } else if ($scope.hours > 12 && $scope.hours < 19) {
                    $scope.helloMessage = $translate.instant('goodAfternoon');
                } else if ($scope.hours >= 19 || $scope.hours < 6) {
                    $scope.helloMessage = $translate.instant('goodEvening');
                }
                var loc = "";
                if ($rootScope.currentLocationString !== undefined) {
                    loc = " " + $rootScope.currentLocationString;
                }
                $scope.answerUsed = $scope.helloMessage + loc + $translate.instant('itis') + $scope.currentWeather.toLowerCase() + "." + " ";
                $scope.answersAll[0] = "";
            }, function(error) {
                var today = new Date();
                $scope.hours = today.getHours();
                if ($scope.hours >= 6 && $scope.hours <= 12) {
                    $scope.helloMessage = $translate.instant('goodMorning');
                } else if ($scope.hours > 12 && $scope.hours < 19) {
                    $scope.helloMessage = $translate.instant('goodAfternoon');
                } else if ($scope.hours >= 19 || $scope.hours < 6) {
                    $scope.helloMessage = $translate.instant('goodEvening');
                }
                $scope.answerUsed = $scope.helloMessage + $translate.instant('InternetConnectionQuestion');
                $scope.answersAll[0] = "";
                $ionicLoading.hide();
                turnOffLoadingQuestions();
            });
        };

        var showedLocationAlert = false;

        function errorLocation(key) {
            if (!showedLocationAlert && $rootScope.myLocation === undefined) {
                $rootScope.currentLocationString = "Lima";
                _this.getCurrent(-12.110373, -77.045456, key, $rootScope.currentLocationString);
                locationPopup();

            }
        }

        $scope.refreshData = function(key) {
            ionic.Platform.ready(function() {
                $timeout(function() {
                    if (typeof google === 'object' && typeof google.maps === 'object') {
                        if ($rootScope.myLocation) {
                            var lat = $rootScope.myLocation.A;
                            var lng = $rootScope.myLocation.F;
                            Geo.reverseGeocode(lat, lng).then(function(locString) {
                                $rootScope.currentLocationString = locString;
                                _this.getCurrent(lat, lng, key, locString);
                            }, function(error) {
                                errorLocation(key);
                            });
                        } else {
                            navigator.geolocation.getCurrentPosition(function(position) {
                                var lat = position.coords.latitude;
                                var lng = position.coords.longitude;

                                Geo.reverseGeocode(lat, lng).then(function(locString) {
                                    $rootScope.currentLocationString = locString;
                                    _this.getCurrent(lat, lng, key, locString);
                                }, function(error) {
                                    errorLocation(key);
                                });
                            }, function(error) {
                                if (refreshDataCounting < 7) {
                                    refreshDataCounting++;
                                    $scope.refreshData($translate.use());
                                } else {
                                    errorLocation(key);
                                }
                            }, {
                                enableHighAccuracy: true,
                                timeout: 1000
                            });
                        }
                    } else {
                        if (refreshDataCounting < 7) {
                            refreshDataCounting++;
                            $scope.refreshData($translate.use());
                        } else {
                            errorLocation(key);
                        }
                    }

                }, 300);
            });
        };

        $scope.filterSecId = function(items) {
            var result = {};
            angular.forEach(items, function(value, key) {
                if (!value.hasOwnProperty('secId')) {
                    result[key] = value;
                }
            });
            return result;
        };

        // Restaurants number logic
        $scope.restaurantsCounting = function() {
            $rootScope.filterRestaurants = $rootScope.restaurantsAll;

            for (var key in $scope.answersChoosen) {
                console.log(key);
                var obj = {};
                if (key === "environmentLocals") {
                    obj[key] = $scope.answersChoosen[key];
                    $rootScope.filterRestaurants = $filter('childArrayContains')($rootScope.filterRestaurants, key, obj[key]);
                } else if (key === "typeOfFoodRestaurant") {
                    obj[key] = $scope.answersChoosen[key];
                    $rootScope.filterRestaurants = $filter('childArrayContains')($rootScope.filterRestaurants, key, obj[key]);
                } else if (key === "isNear") {
                    if ($scope.answersChoosen[key]) {
                        $scope.maxValue = 4;
                        $rootScope.filterRestaurants = $filter('greaterThen')($rootScope.filterRestaurants, 'mts', $scope.maxValue);
                    }
                } else {
                    obj[key] = $scope.answersChoosen[key];
                    $rootScope.filterRestaurants = $filter('filter')($rootScope.filterRestaurants, obj);
                }
            }


            if ($rootScope.filterRestaurants.length < 12) {
                return true;
            } else {
                $scope.restaurantsNumber = $rootScope.filterRestaurants.length;
            }

            if ($rootScope.filterRestaurants.length === 0) {
                $scope.restaurantsNumber = "0";
            }
            var searchRange = 'question--' + $scope.quest.objectId + '--' + $scope.restaurantsNumber;
            console.log(searchRange);
            _analyticsTrackEvent('search_question', 'tap', searchRange, 0);
            return false;
        };


        // Question answer logic

        $scope.sentenceCreation = function(key) {
            var answName = "";
            var answNameEsp = "";
            if ($scope.quest.Answer !== undefined) {
                answName = angular.lowercase($scope.quest.Answer.namesEn[$scope.selectedQuestIndex]);
                answNameEsp = angular.lowercase($scope.quest.Answer.namesEsp[$scope.selectedQuestIndex]);
            }
            if ($translate.use() == 'en') {

                if ($scope.quest.objectId == 'AM2J2lMJKg') {
                    // What would you like to eat today?    
                    if (answName === 'café' || answName === 'restobar') {
                        $scope.answersAll[1] = "You want to go to a " + answName;
                    } else {
                        $scope.answersAll[1] = "You want to eat " + answName;
                    }
                    $scope.answerUsed2 = $scope.answersAll[1] + ".";

                } else if ($scope.quest.objectId === 'mv5xWa6c0D') {
                    var secondCondition = "";
                    if (answName == 'by myself') {
                        secondCondition = "by myself";
                    } else if (answName === 'date') {
                        secondCondition = "with your date";
                    } else if (answName === "business") {
                        secondCondition = "with business partners";
                    } else if (answName === "tourists") {
                        secondCondition = "";
                    } else {
                        secondCondition = "with " + answName;
                    }

                    if ($scope.answersAll[1] === "") {
                        if (secondCondition !== "") {
                            $scope.answersAll[2] = "You want to eat " + secondCondition;
                        }
                    } else {
                        if (secondCondition !== "") {
                            $scope.answersAll[2] = $scope.answersAll[1] + " " + secondCondition;
                        } else {
                            $scope.answersAll[2] = $scope.answersAll[1];
                        }
                    }
                    $scope.answerUsed2 = $scope.answersAll[2] + ".";

                } else if ($scope.quest.objectId === 'Nm9x8Jvu91') {
                    var brightPlace = "dark";
                    if (key == "true") {
                        brightPlace = "bright";
                    }

                    if ($scope.answersAll[2] !== "") {
                        $scope.answersAll[3] = $scope.answersAll[2] + " at a " + brightPlace + " place";
                    } else if ($scope.answersAll[1] !== "") {
                        $scope.answersAll[3] = $scope.answersAll[1] + " at a " + brightPlace + " place";
                    } else {
                        $scope.answersAll[3] = "You want to eat at a " + brightPlace + " place";
                    }
                    $scope.answerUsed2 = $scope.answersAll[3] + ".";

                } else if ($scope.quest.objectId === 'u3XvAA87zj') {
                    // Do you prefer it quiet?
                    var quietPlace = "lively";
                    if (key == "true") {
                        quietPlace = "quiet";
                    }

                    if ($scope.answersAll[3] !== "") {
                        $scope.answersAll[4] = $scope.answersAll[3].replace("place", "and " + quietPlace + " place");
                    } else if ($scope.answersAll[2] !== "") {
                        $scope.answersAll[4] = $scope.answersAll[2] + " at a " + quietPlace + " place";
                    } else if ($scope.answersAll[1] !== "") {
                        $scope.answersAll[4] = $scope.answersAll[1] + " at a " + quietPlace + " place";
                    } else {
                        $scope.answersAll[4] = "You want to eat at a " + quietPlace + " place";
                    }
                    $scope.answerUsed2 = $scope.answersAll[4] + ".";

                } else if ($scope.quest.objectId === 'sp4YVGtG8V') {
                    // Are you looking for a place near you?
                    var nearPlace = "";
                    if (key == "true") {
                        nearPlace = " near you";
                    }

                    if ($scope.answersAll[4] !== "") {
                        $scope.answersAll[5] = $scope.answersAll[4] + nearPlace;
                    } else if ($scope.answersAll[3] !== "") {
                        $scope.answersAll[5] = $scope.answersAll[3] + nearPlace;
                    } else if ($scope.answersAll[2] !== "") {
                        $scope.answersAll[5] = $scope.answersAll[2] + " at a place" + nearPlace;
                    } else if ($scope.answersAll[1] !== "") {
                        $scope.answersAll[5] = $scope.answersAll[1] + " at a place" + nearPlace;
                    } else {
                        if (nearPlace !== "") {
                            $scope.answersAll[5] = "You want to eat at a place" + nearPlace;
                        } else {
                            $scope.answersAll[5] = "You want to eat whatever, wherever!";
                        }
                    }
                    $scope.answerUsed2 = $scope.answersAll[5] + ".";
                } else if ($scope.quest.objectId === 'ItXjO6Tydr') {
                    // Looking for a parking spot / valet?

                }


            } else {

                if ($scope.quest.objectId === 'AM2J2lMJKg') {
                    if (answNameEsp == 'cafe' || answNameEsp == 'restobar') {
                        $scope.answersAll[1] = "Quieres ir a un " + angular.lowercase(answNameEsp);
                    } else if (answNameEsp === 'amazónica' || answNameEsp === 'criolla' || answNameEsp === 'japonesa' || answNameEsp == 'internacional' || answNameEsp == 'vegetariana') {
                        $scope.answersAll[1] = "Quieres comida " + angular.lowercase(answNameEsp);
                    } else {
                        $scope.answersAll[1] = "Quieres comer " + angular.lowercase(answNameEsp);
                    }
                    $scope.answerUsed2 = $scope.answersAll[1] + ".";

                } else if ($scope.quest.objectId === 'mv5xWa6c0D') {
                    var secondConditionEsp = "";
                    if (answNameEsp == 'mi flaco/a') {
                        secondConditionEsp = " con tu flaco/a";
                    } else if (answNameEsp == 'solo') {
                        secondConditionEsp = " solo";
                    } else if (answNameEsp == 'turistas' || answNameEsp == 'turístico') {
                        secondConditionEsp = "";
                    } else {
                        secondConditionEsp = " con " + answNameEsp;
                    }

                    if ($scope.answersAll[1] === "") {
                        if (secondConditionEsp !== "") {
                            $scope.answersAll[2] = "Quieres comer" + angular.lowercase(secondConditionEsp);
                        }
                    } else {
                        if (secondConditionEsp !== "") {
                            $scope.answersAll[2] = $scope.answersAll[1] + angular.lowercase(secondConditionEsp);
                        } else {
                            $scope.answersAll[2] = $scope.answersAll[1];
                        }
                    }
                    $scope.answerUsed2 = $scope.answersAll[2] + ".";

                } else if ($scope.quest.objectId === 'Nm9x8Jvu91') {
                    // Do you prefer it bright?
                    var brightPlaceEsp = "oscuro";
                    if (key == "true") {
                        brightPlaceEsp = "luminoso";
                    }

                    if ($scope.answersAll[2] !== "") {
                        $scope.answersAll[3] = $scope.answersAll[2] + " en un lugar " + brightPlaceEsp;
                    } else if ($scope.answersAll[1] !== "") {
                        $scope.answersAll[3] = $scope.answersAll[1] + " en un lugar " + brightPlaceEsp;
                    } else {
                        $scope.answersAll[3] = "Quieres comer en un lugar " + brightPlaceEsp;
                    }
                    $scope.answerUsed2 = $scope.answersAll[3] + ".";

                } else if ($scope.quest.objectId === 'u3XvAA87zj') {
                    // Do you prefer it quiet?
                    var quietPlaceEsp = "animado";
                    if (key === "true") {
                        quietPlaceEsp = "tranquilo";
                    }

                    if ($scope.answersAll[3] !== "") {
                        $scope.answersAll[4] = $scope.answersAll[3] + " y " + quietPlaceEsp;
                    } else if ($scope.answersAll[2] !== "") {
                        $scope.answersAll[4] = $scope.answersAll[2] + " en un lugar " + quietPlaceEsp;
                    } else if ($scope.answersAll[1] !== "") {
                        $scope.answersAll[4] = $scope.answersAll[1] + " en un lugar " + quietPlaceEsp;
                    } else {
                        $scope.answersAll[4] = "Quieres comer en un lugar " + quietPlaceEsp + " place";
                    }
                    $scope.answerUsed2 = $scope.answersAll[4] + ".";

                } else if ($scope.quest.objectId === 'sp4YVGtG8V') {
                    // Are you looking for a place near you?
                    var nearPlaceEsp = "";
                    if (key == "true") {
                        nearPlaceEsp = "alrededor tuyo";
                    }

                    if ($scope.answersAll[4] !== "") {
                        $scope.answersAll[5] = $scope.answersAll[4].replace(" y", ",") + " y " + nearPlaceEsp;
                    } else if ($scope.answersAll[3] !== "") {
                        $scope.answersAll[5] = $scope.answersAll[3] + " y " + nearPlaceEsp;
                    } else if ($scope.answersAll[2] !== "") {
                        $scope.answersAll[5] = $scope.answersAll[2] + " en un lugar " + nearPlaceEsp;
                    } else if ($scope.answersAll[1] !== "") {
                        $scope.answersAll[5] = $scope.answersAll[1] + " en un lugar " + nearPlaceEsp;
                    } else {
                        if (nearPlaceEsp !== "") {
                            $scope.answersAll[5] = "Quieres comer en un lugar " + nearPlaceEsp;
                        } else {
                            $scope.answersAll[5] = "Quieres comer pero no sabes qué o por dónde!";
                        }
                    }
                    $scope.answerUsed2 = $scope.answersAll[5] + ".";

                } else if ($scope.quest.objectId === 'ItXjO6Tydr') {
                    // Looking for a parking spot / valet?


                }


            }
        };



        function _analyticsTrackEvent(category, action, label, value) {
            if (typeof analytics !== 'undefined') {
                $timeout(function() {
                    $cordovaGoogleAnalytics.trackEvent(category, action, label, value);
                }, 200);
            }
        }


        /* INIT */

        $scope.$on('$ionicView.afterEnter', function() {
            $scope.opacityButtons = 1;
            if ($rootScope.notRefreshQuestion) {
                $rootScope.notRefreshQuestion = false;
            } else {
                if ($rootScope.refreshQuestions === true || downloadDataCache === false) {
                    _init();
                    $rootScope.refreshQuestions = false;
                } else {}
            }
        });
    
       
        $scope.$on('$ionicView.beforeEnter', function() {
             $scope.opacityButtons = 0;
        });
    
        $scope.$on('$ionicView.leave', function() {
             $scope.opacityButtons = 0;
        });



        $ionicPopover.fromTemplateUrl('templates/searchPopover.html', {
            scope: $scope,
        }).then(function(popover) {
            $scope.popover = popover;
        });

        function languageUse() {
            $scope.trEn = false;
            $scope.trEs = true;
            $scope.translate = $translate.use();
            if ($scope.translate == 'en') {
                $scope.trEn = true;
                $scope.trEs = false;
            } else if ($scope.translate == 'es') {
                $scope.trEs = true;
                $scope.trEn = false;
            }
        }
        $scope.loadingQuestionSelect = true;

        function _init() {
            refreshDataCounting = 0;
            $scope.loadingQuestionSelect = true;
            $scope.searchText = "";
            $rootScope.itemsArr = [];
            $rootScope.searchRestaurants = [];
            $scope.itemsDisplaPanel = false;
            $scope.answerUsed2 = "";
            $scope.answersAll = [];
            for (i = 0; i < 5; i++) {
                $scope.answersAll.push("");
            }
            $scope.answersAll.push("");
            _waitForAnalytics();
            if ($rootScope.versionClass === 4.1 || $rootScope.versionDevice === 4.2 || $rootScope.versionDevice === 4.3 && ionic.Platform.isAndroid()) {
                $scope.paddingSelect = "50";
            } else {
                $scope.paddingSelect = "40";
            }
            $scope.hue = "quest-btn-click";
            $scope.index = 0;
            $scope.questionId = "question_select";
            $rootScope.filterRestaurants = [];


            if (downloadData) {

                Ads.getAll().success(function(data) {
                    $rootScope.advertisments = [];
                    $rootScope.advertisments = data.results;
                    $localStorage.ads = btoa(unescape(encodeURIComponent(JSON.stringify($rootScope.advertisments))));
                }).error(function(data, status, headers, config) {
                    $rootScope.advertisments = JSON.parse(decodeURIComponent(escape(window.atob($localStorage.ads))));
                });

                Restaurants.getAllRestaurants().success(function(data) {
                    languageUse();
                    $rootScope.restaurantsAll = [];
                    $rootScope.restaurantsAll = data.results;

                    $scope.restaurantsNumber = $rootScope.restaurantsAll.length;
                    $ionicLoading.hide();
                    turnOffLoadingQuestions();
                    //LOCALIZATION AFTER DOWNLOAD
                    $timeout(function() {
                        if (typeof google === 'object' && typeof google.maps === 'object') {
                            navigator.geolocation.getCurrentPosition(function(pos) {
                                console.log("error google 6");
                                console.log(pos);

                                $rootScope.myLocation = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
                                var lat = pos.coords.latitude;
                                var lng = pos.coords.longitude;

                                Geo.reverseGeocode(lat, lng).then(function(locString) {
                                    $rootScope.currentLocationString = locString;
                                    _this.getCurrent(lat, lng, $translate.use(), locString);
                                }, function(error) {
                                    errorLocation(key);
                                });

                                $localStorage.location = $rootScope.myLocation;
                                _calculateRestaurants();

                            });
                        } else {
                            $rootScope.myLocation = $localStorage.location;
                            if ($rootScope.myLocation) {
                                _calculateRestaurants();
                            }
                        }
                    }, 200);

                }).error(function(data, status, headers, config) {
                    languageUse();
                    $rootScope.restaurantsAll = JSON.parse(decodeURIComponent(escape(window.atob($localStorage.rests))));

                    $scope.restaurantsNumber = $rootScope.restaurantsAll.length;
                    $ionicLoading.hide();
                    turnOffLoadingQuestions();
                    downloadData = true;
                    downloadDataCache = false;
                });



            } else {
                $scope.translate = $translate.use();
                languageUse();

                $scope.quest = $scope.quest;
                $scope.restaurantsNumber = $rootScope.restaurantsAll.length;
                $timeout(function() {
                    $ionicLoading.hide();
                    turnOffLoadingQuestions();
                }, 250);

            }


            function turnOffLoadingQuestions() {
                $timeout(function() {
                    $scope.loadingQuestionSelect = false;
                }, 200);
            }
            $scope.operators = [{
                value: 'eq',
                displayName: 'equals'
            }, {
                value: 'neq',
                displayName: 'not equal'
            }];

            $scope.filterCondition = {
                operator: $scope.operators[0]
            };


            Questions.getAll().success(function(data) {
                languageUse();
                $scope.questions = orderByFilter(data.results, '+order');

                $localStorage.quests = $scope.questions;
                $scope.quest = $scope.questions[0];
                if ($scope.quest.hasAnswer) {
                    $scope.generateSelect();
                    $scope.colSize = "col-20";
                    $(".yes-no").hide();

                } else {
                    $scope.colSize = "col-50";
                    $(".yes-no").show();

                }

            }).error(function(data, status, headers, config) {
                $scope.questions = $localStorage.quests;
                $scope.quest = $scope.questions[0];
                if ($scope.quest.hasAnswer) {
                    $scope.colSize = "col-20";
                    $(".yes-no").hide();


                    $scope.generateSelect();

                } else {
                    $scope.colSize = "col-50";
                    $(".yes-no").show();


                }


            });




            $scope.questions = [];

            $scope.backgrounds = [
                'RGBA(230, 83, 75, 1)',
                'RGBA(74, 73, 69, 1)',
                'RGBA(114, 122, 184, 1)',
                'RGBA(194, 187, 164, 1)',
                'RGBA(230, 83, 75, 1)',
                'RGBA(74, 73, 69, 1)',
                'RGBA(230, 83, 75, 1)',
            ];
            $scope.randomBg = 'RGBA(230, 83, 75, 1)';

            $rootScope.answersChoosen = {};

            $scope.height = window.innerHeight - 170;
            $scope.rowWeatherHeight = $scope.height * 0.20;
            $scope.rowMainHeight = $scope.height * 0.45;
            $scope.rowLocHeight = $scope.height * 0.17;
            $scope.rowSelectButtonHeight = $scope.height * 0.19;
            $scope.rowMainFontSize = $scope.rowMainHeight * 0.19;
            languageUse();
            $scope.refreshData($translate.use());

        }




        _init();







    }
);