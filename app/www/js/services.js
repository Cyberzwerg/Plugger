angular.module('starter.services', [])
/*
  @SERVICE: API
  @DESCRIPTION: API Service used to call the raspberryPI server
*/
.service("api",function($http,localDB,$window){

  if(localStorage.getItem("url") == null){
    // Would have used ionicPopup but no scope available + this is quicker! :D

    localStorage.setItem("url","http://"+$window.prompt("Enter raspbberyPi IP")+":8080/setDeviceStatus")
  }

  return function(homeCode,deviceNumber,state){
    console.log(state)
    localDB.update("devices",{ homeCode: homeCode , deviceNumber: deviceNumber },function(row){
      row.status = state
      return row
    })
    localDB.commit()
    return $http.post(localStorage.getItem("url")+"/"+homeCode+"/"+deviceNumber+"/"+( state == true ? "1" : "0" ))
  }
})

/*
  @SERVICE: localDB
  @DESCRIPTION: Local DB Used to store the devices (localDB by knadh <3 )

*/
.service("localDB",function(){
  lib = new localStorageDB("library", localStorage);

  if( lib.isNew() ){
    lib.createTable("devices",["homeCode","order","deviceNumber","status","title"])

    // Example device
    lib.insert("devices",{
      homeCode: 11111,
      deviceNumber: 2,
      order: 0,
      status: false,
      title: "Lamp"
    })


    lib.commit();
  }
  // Makde DB acessable to rest of the code
  return lib
})