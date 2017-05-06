var forecastioWeather = ['$q', '$resource', '$http', 'FORECASTIO_KEY',
    function($q, $resource, $http, FORECASTIO_KEY) {
        var url = 'https://api.forecast.io/forecast/' + FORECASTIO_KEY + '/';

        var weatherResource = $resource(url, {
            callback: 'JSON_CALLBACK',
        }, {
            get: {
                method: 'JSONP'
            }
        });

        return {
            getAtLocation: function(lat, lng, lang) {
                return $http.jsonp(url + lat + ',' + lng + '?lang=' + lang + '&callback=JSON_CALLBACK');
            },
            getForecast: function(locationString) {},
            getHourly: function(locationString) {},
        };
    }
];

angular.module('donBuscalo.services', ['ngResource'])

.factory('Weather', forecastioWeather)

.factory('Questions', ['$http', 'PARSE_CREDENTIALS',
    function($http, PARSE_CREDENTIALS) {
        return {
            getAll: function() {
                return $http.get('https://api.donbuscalo.pe/parse/classes/Questions', {
                    headers: {
                        'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
                        'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY,

                    },
                    params: {
                        'include': 'Answer'
                    }
                });
            },
            get: function(id) {
                return $http.get('https://api.donbuscalo.pe/parse/classes/Questions/' + id, {
                    headers: {
                        'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
                        'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY,
                    }
                });
            },
            create: function(data) {
                return $http.post('https://api.donbuscalo.pe/parse/classes/Questions', data, {
                    headers: {
                        'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
                        'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY,
                        'Content-Type': 'application/json'
                    }
                });
            },
            edit: function(id, data) {
                return $http.put('https://api.donbuscalo.pe/parse/classes/Questions/' + id, data, {
                    headers: {
                        'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
                        'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY,
                        'Content-Type': 'application/json'
                    }
                });
            },
            delete: function(id) {
                return $http.delete('https://api.donbuscalo.pe/parse/classes/Questions/' + id, {
                    headers: {
                        'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
                        'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY,
                        'Content-Type': 'application/json'
                    }
                });
            }
        };
    }
]).value('PARSE_CREDENTIALS', {
    APP_ID: 'GcoMAqZyIDm1H8ARkBq7PZpDtF0sg7svPDG2Dk4n',
    REST_API_KEY: 'znFIMapztwiEYd7ESDaV2hdRp2vMd0mtILj9temZ'
})

.factory('Ratings', ['$http', 'PARSE_CREDENTIALS',
    function($http, PARSE_CREDENTIALS) {
        return {
            getAll: function(filterCriteria) {
                return $http.get('https://api.donbuscalo.pe/parse/classes/Ratings', {
                    headers: {
                        'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
                        'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY,

                    }
                });
            },
            getByRestaurantId: function(id) {
                return $http.get('https://api.donbuscalo.pe/parse/classes/Ratings', {
                    headers: {
                        'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
                        'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY,
                    },
                    params: {
                        where: {
                            restaurantId: id
                        }
                    }
                });
            },
            getByDeviceIdRestaurantId: function(id, restaurantId) {
                return $http.get('https://api.donbuscalo.pe/parse/classes/Ratings', {
                    headers: {
                        'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
                        'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY,
                    },
                    params: {
                        where: {
                            deviceId: id,
                            restaurantId: restaurantId
                        }
                    }
                });
            },
            create: function(data) {
                return $http.post('https://api.donbuscalo.pe/parse/classes/Ratings', data, {
                    headers: {
                        'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
                        'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY,
                        'Content-Type': 'application/json'
                    }
                });
            },
            edit: function(id, data) {
                return $http.put('https://api.donbuscalo.pe/parse/classes/Ratings/' + id, data, {
                    headers: {
                        'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
                        'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY,
                        'Content-Type': 'application/json'
                    }
                });
            }
        };
    }
]).value('PARSE_CREDENTIALS', {
    APP_ID: 'GcoMAqZyIDm1H8ARkBq7PZpDtF0sg7svPDG2Dk4n',
    REST_API_KEY: 'znFIMapztwiEYd7ESDaV2hdRp2vMd0mtILj9temZ'
})

.factory('Restaurants', ['$http', 'PARSE_CREDENTIALS',
    function($http, PARSE_CREDENTIALS) {
        return {
            getAll: function(filterCriteria) {
                return $http.get('https://api.donbuscalo.pe/parse/classes/RestaurantsOfficial', {
                    headers: {
                        'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
                        'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY,

                    },
                    params: {
                        where: {
                            isVisible: true,
                            parking: filterCriteria.parking,
                            isBright: filterCriteria.isBright,
                            isQuiet: filterCriteria.isQuiet
                        }
                    }
                });
            },
            getAllRestaurants: function() {
                return $http.get('https://api.donbuscalo.pe/parse/classes/RestaurantsOfficial', {
                    headers: {
                        'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
                        'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY,

                    },
                    params: {
                        limit: 10000,
                        where: {
                            isVisible: true
                        }
                    }
                });
            },
            get: function(id) {
                return $http.get('https://api.donbuscalo.pe/parse/classes/RestaurantsOfficial/', {
                    headers: {
                        'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
                        'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY,
                    },
                    params: {
                        where: {
                            objectId: id
                        }
                    }
                });
            }
        };
    }
]).value('PARSE_CREDENTIALS', {
    APP_ID: 'GcoMAqZyIDm1H8ARkBq7PZpDtF0sg7svPDG2Dk4n',
    REST_API_KEY: 'znFIMapztwiEYd7ESDaV2hdRp2vMd0mtILj9temZ'
})


.factory('Ads', ['$http', 'PARSE_CREDENTIALS',
    function($http, PARSE_CREDENTIALS) {
        return {
            getAll: function() {
                return $http.get('https://api.donbuscalo.pe/parse/classes/Advertisments', {
                    headers: {
                        'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
                        'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY,

                    }
                });
            }
        };
    }
]).value('PARSE_CREDENTIALS', {
    APP_ID: 'GcoMAqZyIDm1H8ARkBq7PZpDtF0sg7svPDG2Dk4n',
    REST_API_KEY: 'znFIMapztwiEYd7ESDaV2hdRp2vMd0mtILj9temZ'
})




.factory('ImgCacheImages', ['ImgCacheService', '$localStorage', '$timeout', '$interval', 'ImgCache', '$q', '$rootScope',
    function(ImgCacheService, $localStorage, $timeout, $interval, ImgCache, $q,$rootScope) {
        return {
            cacheAll: function() {
                var cpt;

                var WANTED_SIZE = 200;

                var cacheAll,
                    populateImagesArray;


         
                
                function cacheImages() {
                    
                    var imagesAmount = $rootScope.restaurantsAll.length;

                    progress = 0;
                    
                    var index = 0;
                    var timeoutTime = 50;
                    angular.forEach($rootScope.restaurantsAll, function(rest, key) {
                      index++;    
                      if(index < 20) {        
                                var uri = rest.imageThumbnail.url;
                                 if(uri.match("http://files.parsetfss")) {
                                 ImgCache.getCachedFileURL(uri, function (img, newPath) {
                                 }, function (img) {
                                     ImgCache.cacheFile(img, function() {
                                      
                                 });
                                          
                                      }); 
                                 }
                        
                           
                  
                      }
                    });
                }

                cacheAll = function() {
                    ImgCacheService.ready
                        .then(cacheImages, function(reason) {
                        });
                };

                var progress = 0;
                
                    $timeout(function() {
                        cacheImages();
                    }, 200);
                
                return progress;
            }
        };
    }
])

.factory('RestaurantsImages', ['$http', 'PARSE_CREDENTIALS',
    function($http, PARSE_CREDENTIALS) {
        return {
            getAll: function(restaurant) {
                return $http.get('https://api.donbuscalo.pe/parse/classes/RestaurantsImages', {
                    headers: {
                        'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
                        'X-Parse-REST-API-Key': PARSE_CREDENTIALS.REST_API_KEY,

                    },
                    params: {
                        where: {
                            Restaurant: restaurant
                        }
                    }

                });
            }
        };
    }
]).value('PARSE_CREDENTIALS', {
    APP_ID: 'GcoMAqZyIDm1H8ARkBq7PZpDtF0sg7svPDG2Dk4n',
    REST_API_KEY: 'znFIMapztwiEYd7ESDaV2hdRp2vMd0mtILj9temZ'
})



.constant('DEFAULT_SETTINGS', {
    'tempUnits': 'f'
})

.factory('Geo', function($q) {
    return {
        reverseGeocode: function(lat, lng) {
            var q = $q.defer();

            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({
                'latLng': new google.maps.LatLng(lat, lng)
            }, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (results.length > 1) {
                        var r = results[1];
                        var a, types;
                        var parts = [];
                        var foundLocality = false;
                        var foundState = false;
                        for (var i = 0; i < r.address_components.length; i++) {
                            a = r.address_components[i];
                            types = a.types;
                            for (var j = 0; j < types.length; j++) {
                                if (!foundLocality && types[j] == 'locality') {
                                    foundLocality = true;
                                    parts.push(a.long_name);
                                } else if (!foundState && types[j] == 'administrative_area_level_1') {
                                    foundState = true;
                                    parts.push(a.short_name);
                                }
                            }
                        }
                        q.resolve( /*parts.join(', ')*/ parts[0]);
                    }
                } else {
                    q.reject(results);
                }
            });

            return q.promise;
        },
        getLocation: function() {
            var q = $q.defer();

            navigator.geolocation.getCurrentPosition(function(position) {
                q.resolve(position);
            }, function(error) {
                q.reject(error);
            });

            return q.promise;
        }
    };
})



.filter('childArrayContains', function() {
    return function(input, objKey, objVal) {
        var out = [];
        angular.forEach(input, function(arrRest) {
            arrRest[objKey].forEach(function(entry) {
                if (entry === objVal) {
                    out.push(arrRest);
                }
            });


        });
        return out;
    };
})


.filter('greaterThen', function() {
    return function(input, objKey, maxValue) {
        var out = [];
        angular.forEach(input, function(arrRest) {
            if (arrRest[objKey] <= maxValue) {
                out.push(arrRest);
            }



        });
        return out;
    };
})




.factory('LocationOperations', function() {
    return {
        calcDistance: function(p1, p2) {
            return (google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 1000).toFixed(2);
        }
    };
})


;