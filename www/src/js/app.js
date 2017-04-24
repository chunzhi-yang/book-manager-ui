// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

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

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'views/tabs.html'
  })

  .state('app.bookshelf', {
    url: '/bookshelf',
    templateUrl: 'views/bookshelf/bookshelf-index.html'
     
    
  })
   .state('app.bookstore', {
    url: '/bookstore',
    templateUrl: 'views/bookstore/bookstore.html'
      
  })
   .state('app.self', {
    url: '/self',
    templateUrl: 'views/self/self-index.html'
      
  });
  // if none of the  states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/bookshelf');
}]);
