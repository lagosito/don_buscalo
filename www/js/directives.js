angular.module('donBuscalo.directives', [])
    .directive('vivifysortable', ['$rootScope',
        function($rootScope) {
            return {
                controller: function($scope, $element, $attrs) {
                    // here i pasted definition of multiselectable, 
                    //and multisortable from the above jsfiddle
                },
                link: function($scope, $element, $attrs) {
                    $timeout(function() {
                        angular.element($element).multisortable({

                            connectWith: ".product-backlog-column",
                            selectedClass: "ui-selected"
                        });
                    }, 0);

                }
            };
        }
    ])

.directive('ngsearchtext', function() {
    return function(scope, element, attrs) {
        element.bind("keyup", function(event) {
            if (event.which !== 13) {
                scope.$apply(function() {
                    scope.$eval(attrs.ngsearchtext);
                });

                event.preventDefault();
            }
        });
    };
})

.filter('slice', function() {
  return function(arr, start, end) {
    return (arr || []).slice(start, end);
  };
})

.directive('styleParent', function(){ 
   return {
     restrict: 'A',
     link: function(scope, elem, attr) {
         elem.on('load', function() {
            var w = $(this).width(),
                h = $(this).height();

            var div = elem.parent();

            //check width and height and apply styling to parent here.
         });
     }
   };
})

.directive('compile', ['$compile',
    function($compile) {
        return function(scope, element, attrs) {
            scope.$watch(
                function(scope) {
                    // watch the 'compile' expression for changes
                    return scope.$eval(attrs.compile);
                },
                function(value) {
                    // when the 'compile' expression changes
                    // assign it into the current DOM
                    element.html(value);

                    // compile the new DOM and link it to the current
                    // scope.
                    // NOTE: we only compile .childNodes so that
                    // we don't get into infinite loop compiling ourselves
                    $compile(element.contents())(scope);
                }
            );
        };
    }
])

.directive('imgCache', ['$document',
    function($document) {
        return {
            // require: 'ngSrc',
            link: function(scope, ele, attrs) {
                var target = $(ele);
                //waits for the event to be triggered,
                //before executing d call back
                scope.$on('ImgCacheReady', function() {
                    //this checks if we have a cached copy.
                    ImgCache.isCached(attrs.src, function(path, success) {
                        if (success) {
                            // already cached
                            ImgCache.useCachedFile(target);
                        } else {
                            // not there, need to cache the image
                            ImgCache.cacheFile(attrs.src, function() {
                                ImgCache.useCachedFile(target);
                            });
                        }
                    });
                }, false);
            }
        };
    }
])

.directive('fadeMenu', function($timeout, $ionicSideMenuDelegate) {
  return {
    restrict: 'A',
    link: function($scope, $element, $attr) {
      // Run in the next scope digest
      $timeout(function() {
       
        $scope.$watch(function() { 
          return $ionicSideMenuDelegate.getOpenRatio();
        }, 
          function(ratio) {
            if (ratio === 1) {
                $scope.isOpen = 'is-open';
                $scope.isClosed = true;
                $('.nav-icon').toggleClass('active');
            } else {
                $scope.isOpen = '';
                $scope.isClosed = false;
                 $('.nav-icon').toggleClass('active');
            }
          });
      });
    }
  };
})

;