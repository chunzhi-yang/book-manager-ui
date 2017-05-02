// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var app=angular.module('starter', ['ionic', 'ngFileUpload'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }

    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(['$stateProvider', '$urlRouterProvider','$ionicConfigProvider','$httpProvider',function($stateProvider, $urlRouterProvider,$ionicConfigProvider,$httpProvider) {
    //设置tab的位置为底部
    $ionicConfigProvider.platform.ios.tabs.style('standard');
    $ionicConfigProvider.platform.ios.tabs.position('bottom');
    $ionicConfigProvider.platform.android.tabs.style('standard');
    $ionicConfigProvider.platform.android.tabs.position('bottom');

    $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
    $ionicConfigProvider.platform.android.navBar.alignTitle('center');

    $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
    $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

    $ionicConfigProvider.platform.ios.views.transition('ios');
    $ionicConfigProvider.platform.android.views.transition('android');

    $stateProvider
  .state('login', {
    url: '/login',
    abstract: true,
    template: '<ion-nav-view></ion-nav-view>',
  })
  .state('login.signin', {
    url: '/signin',
    templateUrl: 'views/login_signin.html',
    controller: 'loginCtrl'
  })

  .state('login.signup', {
    url: '/signup',
    templateUrl: 'views/login_signup.html',
    controller: 'loginCtrl'
  })
  .state('login.changepassword', {
    url: '/changepassword/:account',
    templateUrl: 'views/login_changepassword.html',
    controller: 'navsCtrl'
  })
  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'views/tabs.html'
  })

  .state('app.bookshelf', {
    url: '/bookshelf',
    templateUrl: 'views/bookshelf/bookshelf-index.html',
    controller: 'bookshelfCtrl'
  })
   .state('app.bookstore', {
      url: '/bookstore',
      abstract: true,
      template: '<ion-nav-view></ion-nav-view>',
  })
      .state('app.bookstore.index', {
    url: '/index',
    templateUrl: 'views/bookstore/bookstore.html',
    controller: 'bookstoreCtrl'

  })
      .state('app.bookstore.detail', {
        url: '/detail/:id',
        templateUrl: 'views/bookstore/bookstore-detail.html',
        controller: 'bookstoreDetailCtrl'

      })
  .state('app.self', {
      url: '/self',
      abstract: true,
      template: '<ion-nav-view></ion-nav-view>',

  })
    .state('app.self.index', {
    url: '/index',
    templateUrl: 'views/self/self-index.html',
    controller: 'selfCtrl'
  })
      .state('app.self.edit', {
        url: '/edit/:account',
        templateUrl: 'views/self/self-edit.html',
        controller: 'selfEditCtrl'
      });
  // if none of the  states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/bookshelf');
}]).factory('myHttpInterceptor',['$q', '$injector',function($q, $injector){
    return {
        request: function (config) {
            //TODO 带上未知属性会产生一个options请求问题
            var requestUrl = config.url;
            var $location = $injector.get('$location');


            var absUrl = $location.absUrl();
            //  config.headers['X-Access-Url'] = absUrl;
            //  config.headers['Cookie'] = 'JSESSIONID=901A45116F7EFC0253F6F30CE023A740';

            return config;
        },
        requestError: function(rejection) {
            return $q.reject(rejection);
        },
        response: function (response) {

            return response;
        },
        responseError: function(rejection) {
            var $state = $injector.get('$state');
            if(rejection.status === 401){
                $state.go("login.signin");
            }else if(rejection.status === 500) {
                var data=rejection.data;
                if(data.error){
                    try{
                        swal("系统错误");

                    }catch(e){}
                }else{
                    $state.go('error.500');
                }
            }else if(rejection.status === 404){
                try{
                    swal('页面不存在','您要访问的页面不存在');

                }catch(e){}
            }else{
               $state.go('login.signin');
           }
            return $q.reject(rejection);
        }
    };
}]);

