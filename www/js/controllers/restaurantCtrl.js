angular.module('donBuscalo.restaurantCtrl', [])


.controller('RestaurantCtrl', function($scope, Restaurants, Ratings, RestaurantsImages, $timeout, $stateParams, $ionicHistory, $state, $ionicSlideBoxDelegate, $localStorage, $filter, LocationOperations, $cordovaGoogleAnalytics, $ionicLoading, $rootScope, $ionicModal, $cordovaSocialSharing, $ionicPopup, $translate) {

    $scope.canHideArrow = false;
    $scope.canShowArrow = false;
      // set the rate and max variables
    
    $scope.rating = [];
    $scope.ratingDevice = [];
    var getRatings = function () {
        Ratings.getByRestaurantId($stateParams.restaurantId).success(function(data) {
            $scope.rating = data.results;
            $scope.rate = 0;
        
            angular.forEach(data.results, function(value, key){
            $scope.rate = $scope.rate + value.rating;
            });
            var resultRound  = Math.round($scope.rate / data.results.length);
            if(resultRound !== undefined && !isNaN(resultRound)) {
            $scope.ratingsObjectTop.rating = resultRound;
            }
             }).error(function(data, status, headers, config) {
        

    });
    $scope.deviceId = device.uuid;

        
    Ratings.getByDeviceIdRestaurantId($scope.deviceId, $stateParams.restaurantId).success(function(data) {
            $scope.ratingDevice = data.results;
            if($scope.ratingDevice.length > 0) {
                $scope.ratingsObject.rating = $scope.ratingDevice[0].rating;
            }
    }).error(function(data, status, headers, config) {
    });
        
    }
    
    getRatings();
    
    
    $scope.ratingsObjectTop = {
        iconOnColor: 'RGB(255, 255, 255)',  
        iconOffColor:  'RGB(255, 255, 255)',  
        rating:  "x",
        minRating: 0,  
        readOnly: true, 
        callback: function(rating) {    
        }
    };
   
    $scope.ratingsObject = {
        iconOnColor: 'RGB(255, 255, 255)', 
        iconOffColor:  'RGB(255, 255, 255)',    
        rating:  0, 
        minRating: 0,    
        readOnly: false, 
        callback: function(rating) {    
          $scope.ratingsCallback(rating);
        }
    };

      $scope.ratingsCallback = function(rating) {
          
        console.log('Selected rating is : ', rating);
          var ratingObject = {
              "restaurantId": $stateParams.restaurantId, 
              "rating": rating,
              "deviceId" : $scope.deviceId
          }
          if($scope.ratingDevice.length > 0) {
            ratingObject.restaurantId = $scope.ratingDevice[0].restaurantId;
            ratingObject.deviceId = $scope.ratingDevice[0].deviceId;
            ratingObject.rating = rating;
            ratingObject.objectId = $scope.ratingDevice[0].objectId;
              
             Ratings.edit(ratingObject.objectId, ratingObject).success(function(data) {
              console.log('success edit');
                 getRatings();
             }).error(function(data, status, headers, config) {
            }); 
              
          } else {
            Ratings.create(ratingObject).success(function(data) {
              console.log('success create');
                getRatings();
             }).error(function(data, status, headers, config) {
            });  
          }
          
      };
    
    if (typeof analytics !== 'undefined') {
        $timeout(function() {
            $cordovaGoogleAnalytics.trackView('individual_result_screen');
        }, 300);
    }

    if ($localStorage.language == 'en') {
        $scope.trEn = true;
    } else {
        $scope.trEn = false;
    }

    function restaurantOperation() {
        $rootScope.restaurant.hours = $rootScope.restaurant.hours.replace(/,/g, "<br/>").replace(/0pm/g, "0 pm").replace(/0am/g, "0 am").replace(/-/g, " - ").replace(/:1/g, ": 1");
        $rootScope.restaurant.hoursEsp = $rootScope.restaurant.hoursEsp.replace(/,/g, "<br/>").replace(/0pm/g, "0 pm").replace(/0am/g, "0 am").replace(/-/g, " - ").replace(/:1/g, ": 1");
        if ($rootScope.isInternetCheck()) {
            $timeout(function() {
                var restLocation = new google.maps.LatLng($rootScope.restaurant.latitude, $rootScope.restaurant.longitude);
                if ($rootScope.myLocation !== undefined) {
                    $rootScope.restaurant.mts = LocationOperations.calcDistance($rootScope.myLocation, restLocation);
                }
            }, 100);
        }

        if ($localStorage.favouritesRestaurants !== undefined) {
            var single_object = $filter('filter')($localStorage.favouritesRestaurants, function(d) {
                return d.objectId === $rootScope.restaurant.objectId;
            })[0];
            if (single_object !== undefined) {
                $scope.btnLove = "btn-love-selected";
            }

        }


        $timeout(function() {
            $scope.canHideArrow = true;
            $scope.canShowArrow = true;
            $ionicLoading.hide();
        }, 250);
    }

    $rootScope.restaurantImages = [];
    $rootScope.showNav = false;
    $scope.btnLove = "btn-love";
    $scope.goBack = function() {
        _analyticsTrackEvent('individual_result_screen', 'tap', $rootScope.restaurant.name, 0);
        window.history.back();
    };
    $rootScope.restaurantId = $stateParams.restaurantId;
    $rootScope.restaurant = {
        '__type': "Pointer",
        'className': "Restaurants",
        "objectId": $rootScope.restaurantId
    };
    $timeout(function() {
        /*if($rootScope.isInternetCheck()) {
        Restaurants.get($rootScope.restaurantId).success(function (data) {
            $rootScope.restaurant = data.results[0];
            
        
        }).
        error(function(data, status, headers, config) {
            $rootScope.restaurant = objectFindByKey($rootScope.restaurantsAll, 'objectId', $rootScope.restaurantId);
            $ionicLoading.hide();
        });
        } else {
            $rootScope.restaurant = objectFindByKey($rootScope.restaurantsAll, 'objectId', $rootScope.restaurantId);
            $ionicLoading.hide();
        }*/
        $rootScope.restaurant = objectFindByKey($rootScope.restaurantsAll, 'objectId', $rootScope.restaurantId);
        restaurantOperation();

        /* RestaurantsImages.getAll($rootScope.restaurant).success(function (data) {
            $rootScope.restaurantImages = data.results;
            $ionicSlideBoxDelegate.update();
            ;
        });*/
    });

    var link = "www.donbuscalo.pe";

    // An elaborate, custom popup


    $scope.showAlertFailed = function(message) {
        var alertPopup = $ionicPopup.alert({
            title: $translate.instant('sharingFailed'),
            template: $translate.instant('sharingSorry') + message
        });
        alertPopup.then(function(res) {
            $scope.btnClickCloseShare();
        });
    };

    $scope.showAlertSuccess = function() {
        $scope.btnClickCloseShare();
    };

    $scope.btnSharingTwitter = function(message) {
        var mes = "";
        if (message !== undefined) {
            mes = message + '  ' + $rootScope.restaurant.name + ' ' + link + ' #DonBuscalo';
        } else {
            mes = $rootScope.restaurant.name + ' ' + link + ' #DonBuscalo';
        }
        $cordovaSocialSharing
            .shareViaTwitter(mes, null, link)
            .then(function(result) {
                $scope.showAlertSuccess();
            }, function(err) {
                $scope.showAlertFailed("Twitter");
            });
    };
    
    $scope.goToWeb = function() {
        if ($rootScope.restaurant.web.indexOf("http") != -1) {
            window.open($rootScope.restaurant.web, "_system");
        } else if($rootScope.restaurant.web.indexOf("ww") != -1) {
            window.open("http://" + $scope.restaurant.web, "_system");
        }
    };
    
    $scope.btnSharingFacebook = function(message) {
        var mes = "";
        if (message !== undefined) {
            mes = message + '     ' + $rootScope.restaurant.name + ' ' + $rootScope.restaurant.address + '. ' + $translate.instant('found-don') + ' ' + link + ' #DonBuscalo';
        } else {
            mes = $rootScope.restaurant.name + ' ' + $rootScope.restaurant.address + '. ' + $translate.instant('found-don') + ' ' + link + ' #DonBuscalo';
        }

        $cordovaSocialSharing
            .shareViaFacebookWithPasteMessageHint(mes, [$scope.restaurant.imageThumbnail.url, 'http://files.parsetfss.com/db095151-6ca7-4005-af3c-eadf174ddf56/tfss-53b34840-36b8-49a0-94d3-7c68022daba4-logo.jpg'], link)
            .then(function(result) {
                $scope.btnClickCloseShare();
            }, function(err) {
                $scope.showAlertFailed("Facebook");
            });

    };

    $scope.btnSharingWhatsApp = function(message) {
        var mes = "";
        if (message !== undefined) {
            mes = message + '        ' + $rootScope.restaurant.name + ' ' + $rootScope.restaurant.address + '. ' + link + ' #DonBuscalo';
        } else {
            mes = $rootScope.restaurant.name + ' ' + $rootScope.restaurant.address + '. ' + link + ' #DonBuscalo';
        }

        $cordovaSocialSharing
            .shareViaWhatsApp(mes, null, null)
            .then(function(result) {
                $scope.btnClickCloseShare();
                $scope.showAlertSuccess();
            }, function(err) {
                $scope.showAlertFailed("WhatsApp");
            });
    };

    $scope.hideArrow = function() {
        $scope.canHideArrow = false;
        $scope.canShowArrow = false;
        $scope.$broadcast('scroll.infiniteScrollComplete');
    };
    $scope.btnSharingSMS = function(message) {
        $scope.sms = {};
        var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="sms.phonenumber" style="padding-left: 10px;padding-right: 10px; text-align: center;">',
            title: $translate.instant('share-title-sms'),
            subTitle: $translate.instant('share-description-sms'),
            scope: $scope,
            buttons: [{
                text: 'CANCEL'
            }, {
                text: $translate.instant("send"),
                type: 'button-positive',
                onTap: function(e) {
                    if (!$scope.sms.phonenumber) {
                        //don't allow the user to close unless he enters wifi password
                        e.preventDefault();
                    } else {
                        return $scope.sms.phonenumber;
                    }
                }
            }, ]
        });
        myPopup.then(function(res) {
            if (res !== undefined && res !== "") {
                ionicLoad();
                var mes = "";
                if (message !== undefined) {
                    mes = message + " " + $restaurant.name + " " + link;
                } else {
                    mes = $scope.restaurant.name + " " + link;
                }
                $cordovaSocialSharing
                    .shareViaSMS(mes, res)
                    .then(function(result) {
                        $ionicLoading.hide();
                        $scope.showAlertSuccess();
                    }, function(err) {
                        $scope.showAlertFailed("SMS");
                    });
            }
        });

    };
    // access multiple numbers in a string like: '0612345678,0687654321'

    function ionicLoad() {
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: false,
            maxWidth: 200,
            showDelay: 0
        });
    }

    $scope.btnSharingEmail = function(message) {
        var mes = "";
        if (message !== undefined) {
            mes = message + ' ' + $rootScope.restaurant.name + ' ' + $rootScope.restaurant.address + '. ' + link + ' #DonBuscalo';
        } else {
            mes = $rootScope.restaurant.name + ' ' + $rootScope.restaurant.address + '. ' + link + ' #DonBuscalo';
        }
        $cordovaSocialSharing
            .shareViaEmail(mes, $translate.instant('subject-share'), null, null, null, $scope.restaurant.imageThumbnail.url)
            .then(function(result) {
                $scope.showAlertSuccess();
            }, function(err) {
                $scope.showAlertFailed("Email");
            });
    };



    $('input,textarea').focus(function() {
        $(this).removeAttr('placeholder');
    });



    $ionicModal.fromTemplateUrl('templates/sharing.html', function($ionicModal) {
        $scope.modal = $ionicModal;

    }, {
        // Use our scope for the scope of the modal to keep it simple
        scope: $scope,
        // The animation we want to use for the modal entrance
        animation: 'fade-in'
    });
    $scope.btnClickShare = function() {
        $scope.modal.show();
        $scope.sharingDetail = false;
    };

    $scope.btnClickCloseShare = function() {
        $scope.modal.hide();
        $scope.sharingDetail = yes;
    };

    $scope.btnClickLove = function() {
        if ($localStorage.favouritesRestaurants === undefined) {
            $localStorage.favouritesRestaurants = [];
        }
        var single_object = $filter('filter')($localStorage.favouritesRestaurants, function(d) {
            return d.objectId === $rootScope.restaurant.objectId;
        })[0];
        if (single_object === undefined) {
            var rest = $rootScope.restaurant;
            $localStorage.favouritesRestaurants.push(angular.copy($rootScope.restaurant));
            $scope.btnLove = "btn-love-selected";
        } else {
            removeItem($localStorage.favouritesRestaurants, single_object);
            $scope.btnLove = "btn-love";
        }

    };

        $scope.btnPhone = function() {

            window.location.href= "tel:"+$rootScope.restaurant.telephone;
        };


        function removeItem(array, item) {
        for (var i in array) {
            if (array[i] == item) {
                array.splice(i, 1);
                break;
            }
        }
    }


    $scope.next = function() {
        $ionicSlideBoxDelegate.next();
    };
    $scope.previous = function() {
        $ionicSlideBoxDelegate.previous();
    };

    // Called each time the slide changes
    $scope.slideChanged = function(index) {
        $scope.slideIndex = index;
    };

    function _analyticsTrackEvent(category, action, label, value) {
        if (typeof analytics !== 'undefined') {
            $timeout(function() {
                $cordovaGoogleAnalytics.trackEvent(category, action, label, value);
            }, 300);
        }

    }

    function objectFindByKey(array, key, value) {
        for (var i = 0; i < array.length; i++) {
            if (array[i][key] === value) {
                return array[i];
            }
        }
        return null;
    }
});