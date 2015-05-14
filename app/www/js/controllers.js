angular.module('starter.controllers', [])

.service("secret",function(){
	if(null == localStorage.getItem("secret")){		
	  localStorage.setItem("secret",prompt("Enter firebase Secret"))
	}
	return function(){
		return localStorage.getItem("secret")
	}
})

.service("firebaseUrl",function(){
	if(null == localStorage.getItem("firebaseUrl")){		
	  localStorage.setItem("firebaseUrl",prompt("Enter firebase URL"))
	}
	return function(){
		return localStorage.getItem("firebaseUrl")
	}
})

.service("devices",function($firebaseArray,secret,firebaseUrl){
	var ref = new Firebase(firebaseUrl())
	ref.authWithCustomToken(secret(), function(error, authData) {
		if(error !== null){
			localStorage.setItem("secret",prompt("Enter firebase Secret"))
			window.location.reload()
		}
	})
	return $firebaseArray(ref)
})


.controller('dashCtrl', function($scope,$state,devices) {
	
	devices.$loaded(function(){

		$scope.devices = devices
	})
	
	$scope.quickToggle = function(device){
		device.status = !device.status
		devices.$save(device)
	}
	
	// Link to another state... 
	$scope.addDevice = function(){
		$state.go("addDevice")
	}

	$scope.showDevice = function(device){
		$state.go("device",{ deviceId: device.$id})
	}


	// Show delete
	$scope.toggleDelete = function(){
		$scope.shouldShowDelete = !$scope.shouldShowDelete
	}

	// Delete device function
	$scope.deleteDevice = function(index){

		$scope.devices.$remove(index)
	}

})
/*
	@CONTROLLER: DeviceCtrl
*/
.controller("deviceCtrl",function($scope,devices,$stateParams,$timeout){
	devices.$loaded(function(){
		_.each(devices,function(device){
			if(device.$id == $stateParams.deviceId){
				$scope.device = device
			}
		})
	})
	$scope.save  = function(device){
		devices.$save(device)
	}

	$scope.timer = {
		timeout: 1,
		state: true,
		multiplier: 60000
	}
	$scope.applyTimer = function(){

		$scope.device.status = $scope.timer.state
		$scope.device.timer = {
			apply: true,
			targetTime: Date.now()+$scope.timer.timeout*$scope.timer.multiplier
		}
		$scope.save($scope.device)
	}

})	

/*
	@CONTROLLER: addDeviceCtrl
	@DESCRIPTION: Add a device to the local database
*/
.controller('addDeviceCtrl', function($scope,$state,devices) {

  $scope.devices = devices

  $scope.addDevice = {
  	deviceNumber: 1,
  	title: "",
  	homeCode: [true,true,true,true,true]
  }
  // Convert bool 
  getNumber = function(bool){
  	return bool == true ? 1 : 0
  }
  // Convert home-code string
  $scope.getHomeCode = function(){
  	homeCode = ""
  	_.each($scope.addDevice.homeCode,function(val){
  		homeCode += getNumber(val)
  	})
  	return homeCode
  }
  // Add a device to the database
  $scope.addDeviceConfirm = function(){

  	// Get new order (length of database)
  	$scope.devices.$add({
  		onSunrise: "none",
  		onSunset: "none",
  		homeCode: $scope.getHomeCode(),
		deviceNumber: $scope.addDevice.deviceNumber,
		status: false,
		title: $scope.addDevice.title
  	})


  	$state.go("dash")
  }
})

.controller('settingsCtrl', function($scope) {
  $scope.connectionInfo = {
  	url: localStorage.getItem("firebaseUrl")
  }
  $scope.setUrl = function(){
  	localStorage.setItem("firebaseUrl",$scope.connectionInfo.url)
  }
});
