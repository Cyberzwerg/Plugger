angular.module('starter.controllers', [])



.controller('DashCtrl', function($scope,localDB,api,$state) {

	// Method to retrieve the devices
	getDevices = function(){
		$scope.devices = localDB.queryAll("devices",{ sort: [["order", "ASC"]] })	
	}

	// Inital Call
	getDevices()

	// Make sure the devices are updated when view is shown again
	$scope.$on("$ionicView.beforeEnter",function(){
		getDevices()
	})

	// Toggle a device
	$scope.toggle  = function(device){
		api(device.homeCode,device.deviceNumber,device.status)	
	}

	// Link to another state... 
	$scope.addDevice = function(){
		$state.go("tab.addDevice")
	}

	// Sync function allows to write all states to the devices
	$scope.sync = function(){
		_.each(localDB.queryAll("devices"),function(device){
			api(device.homeCode,device.deviceNumber, device.status)			
		})
	}

	// Show reorder
	$scope.toggleReorder = function(){
		$scope.shouldShowReorder = !$scope.shouldShowReorder
	}

	// Show delete
	$scope.toggleDelete = function(){
		$scope.shouldShowDelete = !$scope.shouldShowDelete
	}

	// Delete device function
	$scope.deleteDevice = function(index){
		// Get device 
		thisDevice = $scope.devices[index]

		// Delete from database

		localDB.deleteRows("devices",{ order: thisDevice.order })

		// TODO: confirm dialog

		// Save and update view
		localDB.commit()
		getDevices()
	}

	// Reoarder function
	$scope.reorder = function(item,fromIndex,toIndex){

		// Get devices which switch place
		fromDevice = $scope.devices[fromIndex]
		toDevice = $scope.devices[toIndex]

		// Set the "order" attribute
		localDB.update("devices",{ order: fromDevice.order },function(row){
			row.order = toDevice.order
			return row
		})

		localDB.update("devices",{ order: toDevice.order },function(row){
			row.order = fromDevice.order
			return row
		})

		// Save and update view.
		localDB.commit()
		getDevices()
	}

})

/*
	@CONTROLLER: addDeviceCtrl
	@DESCRIPTION: Add a device to the local database
*/
.controller('addDeviceCtrl', function($scope, Chats,localDB,$state) {
  // Initial values
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
  	newOrder = localDB.rowCount("devices")

  	// Insert device
  	localDB.insert("devices",{

  		homeCode: $scope.getHomeCode(),
		deviceNumber: $scope.addDevice.deviceNumber,
		order: newOrder,
		status: false,
		title: $scope.addDevice.title
  	})

  	// Save changes
  	localDB.commit()
  	// Go back to the dashboard
  	$state.go("tab.dash")
  }
})

.controller('SettingsCtrl', function($scope) {
  $scope.connectionInfo = {
  	url: localStorage.getItem("url")
  }
  $scope.setUrl = function(){
  	localStorage.setItem("url",$scope.connectionInfo.url)
  }
});
