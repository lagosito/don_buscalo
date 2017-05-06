angular.module('donBuscalo.locationCtrl', [])


    .controller('LocationCtrl', function ($scope, $timeout, $ionicLoading, $compile, $ionicHistory, $ionicSlideBoxDelegate, $rootScope, $filter, $cordovaGoogleAnalytics) {

        var directionsService;
        var directionsDisplay, myLocationMarker;
        var canSetCenter = true;
        var markerMyLocationImage = new google.maps.MarkerImage('img/icon/ico-my-location.png',
            new google.maps.Size(62, 62),
            new google.maps.Point(0, 0),
            new google.maps.Point(32, 32));


        var mapSel = new google.maps.MarkerImage('img/icon/map-ico.svg',
            new google.maps.Size(62, 62),
            new google.maps.Point(0, 0),
            new google.maps.Point(32, 32));

        var mapNotSel = new google.maps.MarkerImage('img/icon/map-not-sel.svg',
            new google.maps.Size(62, 62),
            new google.maps.Point(0, 0),
            new google.maps.Point(32, 32),
            new google.maps.Size(30, 43));


        var mapOptions = {
            center: null,
            zoom: 17,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true,
            setZoomGesturesEnabled: true
        };

        $rootScope.map = new google.maps.Map(document.getElementById("map"), mapOptions);


        directionsService = new google.maps.DirectionsService();
        directionsDisplay = new google.maps.DirectionsRenderer({
            polylineOptions: {
                strokeColor: "#A7A7A7"
            }
        });
        directionsDisplay.setMap($rootScope.map);
        directionsDisplay.setOptions({
            suppressMarkers: true,
            preserveViewport: true
        });

        $scope.goBack = function () {
            var historyView = $ionicHistory.viewHistory();
            $scope.locRest = undefined;
            if (historyView.backView.stateName == 'app.questions') {
                $rootScope.notRefreshQuestion = true;
            }
            window.history.back();
        };

        $scope.$on('$ionicView.beforeEnter', function () {
            if( $scope.locationClicked)return;
            $scope.title = "";
            canSetCenter = true;
            $scope.locRest = [];
            if ($rootScope.restaurantsLocation !== undefined && $rootScope.restaurantsLocation !== null) {
                if ($rootScope.restaurantsLocation.length !== 0) {

                    $rootScope.restaurantsLocation = $filter('filter')($rootScope.restaurantsLocation, {
                        name: '!advertising'
                    });
                    if ($rootScope.myLocation !== undefined) {
                        $rootScope.restaurantsLocation = $filter('orderBy')($rootScope.restaurantsLocation, "mts");
                    }
                    if ($rootScope.restaurantsLocation.length > 20) {
                        $rootScope.restaurantsLocation.splice(20, $rootScope.restaurantsLocation.length);
                    }

                    angular.copy($rootScope.restaurantsLocation, $scope.locRest);
                }
            }

        });

        $scope.$on('$ionicView.enter', function () {
            if( $scope.locationClicked)return;
            $timeout(function () {
                if (angular.isDefined($rootScope.map)) {
                    google.maps.event.trigger($rootScope.map, 'resize');
                }
                var startLocation = new google.maps.LatLng(-12.0552581, -77.0802907);

                if ($scope.locRest.length > 0) {
                    startLocation = new google.maps.LatLng($scope.locRest[0].latitude, $scope.locRest[0].longitude);
                } else {
                    if ($rootScope.myLocation !== undefined) {
                        startLocation = $rootScope.myLocation;
                    } else {
                        $rootScope.myLocation = startLocation;
                    }
                }
                customizeLocRest();
                $scope.sliderVisible = false;
                if ($scope.locRest.length > 0) {
                    google.maps.event.addDomListener(document.getElementById("map"), 'load', init());
                } else {
                    $ionicLoading.hide();
                }


            }, 0);

        });

        function init() {
            if ($rootScope.myLocation !== undefined) {
                myLocationMarker = new google.maps.Marker({
                    position: $rootScope.myLocation,
                    map: $rootScope.map,
                    icon: markerMyLocationImage,
                    title: "My Location"
                });

                slideChanging(0);

            }

            navigator.geolocation
                .watchPosition(
                function (pos) {
                    $rootScope.myLocation = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
                    if (myLocationMarker !== undefined) {

                        myLocationMarker.setPosition(
                            $rootScope.myLocation
                        );
                        myLocationMarker.setMap(
                            $rootScope.map
                        );
                        myLocationMarker.setIcon(
                            markerMyLocationImage
                        );
                    } else {
                        myLocationMarker = new google.maps.Marker({
                            position: $rootScope.myLocation,
                            map: $rootScope.map,
                            icon: markerMyLocationImage,
                            title: "My Location"
                        });
                    }
                    slideChanging($ionicSlideBoxDelegate.currentIndex());
                },
                function (e) {
                    slideChanging(0);
                }, {
                    enableHighAccuracy: true,
                    timeout: 10000
                });


            $ionicLoading.hide();
        }


        if ($rootScope.versionClass == "and41") {
            $scope.paddingAnd41 = "padding-left: 15px";
        }


        $scope.next = function () {
            $ionicSlideBoxDelegate.next();
        };
        $scope.previous = function () {
            $ionicSlideBoxDelegate.previous();
        };

        // Called each time the slide changes
        $scope.slideChanged = function (index) {
           // canSetCenter = true;
            slideChanging(index);
        };

        $scope.locationClick = function () {
            $scope.locationClicked = true;
            $scope.goRestaurant($scope.locRest[$scope.slideIndex].objectId);
        };

        function slideChanging(index) {
            $scope.slideIndex = index;
            if ($scope.locRest !== undefined) {
                var locRestaurant = $scope.locRest[$scope.slideIndex];
                console.log(locRestaurant.latitude, locRestaurant.longitude);
                var restLocation = new google.maps.LatLng(locRestaurant.latitude, locRestaurant.longitude);

                var travMode = google.maps.DirectionsTravelMode.DRIVING;
                if (locRestaurant.mts < 1.5) {
                    travMode = google.maps.DirectionsTravelMode.WALKING;
                }

                if (locRestaurant.mts < 200 && $rootScope.myLocation !== undefined) {
                    calcDirectionRoute(restLocation, travMode);
                }

                if (canSetCenter) {
                    $rootScope.map.setCenter(restLocation);
                    canSetCenter = false;
                }

                angular.forEach($scope.locRest, function (obj, i) {
                   // obj.locationMarker.setIcon(mapNotSel);
                    if(i == $scope.slideIndex){
                        obj.locationMarker.setIcon(mapSel);

                        // $scope.locRest[$scope.slideIndex].locationMarker.setIcon(mapSel);
                    }else{
                        obj.locationMarker.setIcon(mapNotSel);

                    }
                });

                $scope.title = locRestaurant.name;

                canSetCenter = true;
            }
        }

        if (typeof analytics !== 'undefined') {
            $timeout(function () {
                $cordovaGoogleAnalytics.trackView('map_screen');
            }, 400);
        }

        function customizeLocRest() {
            if ($scope.locRest !== undefined || $scope.locRest !== null) {
                if ($scope.locRest.length !== 0) {
                    $scope.sliderVisible = true;
                    angular.forEach($scope.locRest, function (obj, i) {
                        var restLocation = new google.maps.LatLng(obj.latitude, obj.longitude);
                        obj.locationMarker = new google.maps.Marker({
                            position: restLocation,
                            map: $rootScope.map,
                            icon: mapNotSel,
                            title: obj.name
                        });

                        google.maps.event.addListener(obj.locationMarker, 'click', function () {
                            canSetCenter = false;
                            $ionicSlideBoxDelegate.slide(i);
                        });

                    });
                }
            }
        }

        function calcDirectionRoute(restLocation, travMode) {
            if ($rootScope.myLocation !== undefined) {
                var request = {
                    origin: $rootScope.myLocation,
                    destination: restLocation,
                    travelMode: travMode
                };

                directionsService.route(request, function (response, status) {
                    if (status == google.maps.DirectionsStatus.OK) {
                        directionsDisplay.setDirections(response);
                    }
                });
            }
        }

        function _analyticsTrackEvent(category, action, label, value) {
            if (typeof analytics !== 'undefined') {
                $timeout(function () {
                    $cordovaGoogleAnalytics.trackEvent(category, action, label, value);
                }, 400);
            }
        }

    });