
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','firebase'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      StatusBar.styleLightContent();
    }
  });
})
.config(function($ionicConfigProvider) {
  if(!ionic.Platform.isIOS())$ionicConfigProvider.scrolling.jsScrolling(false);
})
.config(function($stateProvider, $urlRouterProvider) {


  $stateProvider

  // setup an abstract state for the tabs directive
  // Dashboard
  .state('dash', {
    url: '/dash',
    templateUrl: 'templates/devices.html',
    controller: 'dashCtrl'
  })
  // Add device
  .state('addDevice', {
    url: '/addDevice',
    templateUrl: 'templates/addDevice.html',
    controller: "addDeviceCtrl"
  })
  // Add device
  .state('device', {
    url: '/device/:deviceId',
    templateUrl: 'templates/device.html',
    controller: "deviceCtrl"
  })
  // Settings
  .state('settings', {
    url: '/settings',
    templateUrl: 'templates/settings.html',
    controller: 'settingsCtrl'
  });

  $urlRouterProvider.otherwise('/dash');

});
