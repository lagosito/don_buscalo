angular.module('donBuscalo.languageCtrl', [])


.controller('LanguageCtrl', function ($scope, $rootScope, $state, $translate, $timeout, $ionicPlatform, $cordovaGoogleAnalytics, $ionicLoading, $ionicPopup, $localStorage, $cordovaNetwork) {
    
    
    function goQuestionWithLoading() {
        $translate.use($localStorage.language);
        
       $state.go('app.questions', {
            navTransition: 'ios'
        });
        }
    
    if ($localStorage.language === undefined) {
       
    } else   {
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
       goQuestionWithLoading();
    }
    
    var deregister = $ionicPlatform.registerBackButtonAction(function(e) {
                 e.preventDefault();
              navigator.app.backHistory();
            return false;
        }, 101);
        $scope.$on('$destroy', deregister);    
    
    $scope.versionDevice = ionic.Platform.version();
    ionic.Platform.ready(function(){
    $scope.versionDevice = ionic.Platform.version();
    });
 
    $scope.$watch('versionDevice', function () {
        console.log($scope.versionDevice);
        if($rootScope.versionDevice === 4.1 || $rootScope.versionDevice === 4.2 || $rootScope.versionDevice === 4.3)  {
        $scope.versionClass = 'and41';
        }
    });
    
    $scope.changeLanguage = function (key) {
         $translate.use(key);
         $localStorage.language = key;
        $rootScope.refreshQuestions = true;
        if(window.Connection) {
         if(navigator.connection.type == Connection.NONE) {
             $ionicPopup.alert({
          title: $translate.instant('InternetConnection'),
          content: $translate.instant('InternetConnectionDescription')
        })
        .then(function(result) {
          if(!result) {
          }
        });
        
         } else {
      $scope.goQuestView(key);
    }
        } else {
         $scope.goQuestView(key);
        }
   };
    $scope.goQuestView = function (key) {
        $rootScope.afterLanguage = true;
        var label = "language";
        if(key === 'en') {
            label = "language--english";
        } else if(key === 'es') {
            label = "language--espanol";
        }
        if(typeof analytics !== 'undefined'){
        
         $timeout(function() {
                      $cordovaGoogleAnalytics.trackEvent('loader_screen', 'tap', label, 0);
                    }, 200);  
        }
       
        
     
        $state.go('app.questions', {
            navTransition: 'ios'
        });
    $ionicLoading.show({
    content: 'Loading',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
    });
    };
    $scope.topHeight = (window.innerHeight * 0.44) - 200;
    $scope.btnLangSize = window.innerWidth * 0.30;
    $scope.btnLangFontSize = $scope.btnLangSize * 0.18;
    function _waitForAnalytics(){
    if(typeof analytics !== 'undefined'){
        $timeout(function(){
        $cordovaGoogleAnalytics.trackView('loader_screen');
        }, 300);
    }
    else{
        setTimeout(function(){
            _waitForAnalytics();
        },250);
    }
    }
    _waitForAnalytics();
   
})

;