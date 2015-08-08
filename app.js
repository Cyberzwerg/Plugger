var Firebase = require("firebase");
var request = require("request");
var SunCalc = require("suncalc");
var schedule = require('node-schedule');
var colors = require("colors");
var config = require("./config.json");
var exec = require('child_process').exec;
var request = require('request');

var que = [];

// STARTING UP
console.log("Starting Plugger Server...".green)

// Connect to firebase
var fire = new Firebase(config.firebaseUrl);
var ref = fire.child("devices")
var sunTimes = fire.child("sunTimes");
var devices;



var getSunCalc = function(callback) {
    // GET LOCATION
    request('http://ip-api.com/json', function(error, response, body) {

        // CHECK IF ERROR OCCURED
        if (!error && response.statusCode == 200) {

            // PARSE RESPONSE
            body = JSON.parse(body);

            // GET SUNRISE/SUNSET        
            times = SunCalc.getTimes(new Date, body.lat, body.lon)
            sunTimes.update({
                sunrise: times.sunrise.getTime(),
                sunset: times.sunset.getTime()

            })
            callback(times)
            

        }
    })
}

var schedules = {}

var scheduleSunTime = function(time) {

    getSunCalc(function(times) {
        if(Date.now() < times[time]){
            schedules[time] = schedule.scheduleJob(new Date(times[time]), function() {
                console.log("Time was triggered: "+time+"!".green)
                for (var key in devices) {
                    value = p[key]
                    name = time == "sunrise" ? "onSunrise" : "onSunset"
                    switch(value[name]){
                        case 'on':
                            value.status = true
                            break;
                        case 'off':
                            value.status = false
                            break;
                        case 'toggle':
                            value.status = !value.status
                            break;
                        
                    }
                    ref.child(key).update({
                        status: value.status
                    })
                }
            })
        }
    })
}



// Authenticate
ref.authWithCustomToken(config.firebaseSecret, function(error, authData) {

    // Check for errors
    if (error == null) {

        console.log("Successfully connected to firebase!".green);

        // FUNCTION TO COMMUNICATE WITH 433 MHz transmitter
        var sendState = function(homeCode, deviceNumber, status) {
            homeCode = parseInt(homeCode)
            deviceNumber = parseInt(deviceNumber)
            status = status == true ? "1" : "0"
            que.push("~/raspberry-remote/send " + homeCode + " " + deviceNumber + " " + status)
        }

        // Processing call que
        setInterval(function() {
            if (que.length > 0) {
                exec(que[0])
                console.log(que[0].green)
                que.shift()
            }
        }, 300);


        // SETUP SCHEDULES
        console.log("Retrieving Sunet/Sunrise");
        scheduleSunTime("sunrise")
        scheduleSunTime("sunset")
        var started = false

        ref.on("value", function(snapshot) {
            devices = snapshot.val();
            if (started == false) {
                p = devices
                for (var key in p) {
                    value = p[key]
                    sendState(value.homeCode, value.deviceNumber, value.status)
                }
            }
        })



        var jobs = {};

        // Sync plug when saved
        ref.on("child_changed", function(snapshot) {
            var changedOutlet = snapshot.val();
            sendState(changedOutlet.homeCode, changedOutlet.deviceNumber, changedOutlet.status)
            if ("timer" in changedOutlet) {
                if (changedOutlet.timer.apply == true) {

                    if (snapshot.key() in jobs) {
                        jobs[snapshot.key()].cancel()
                    }
                    jobs[snapshot.key()] = schedule.scheduleJob(new Date(changedOutlet.timer.targetTime), function() {
                        ref.child(snapshot.key()).update({
                            status: !changedOutlet.status
                        })
                    })
                    ref.child(snapshot.key()).child("timer").update({
                        apply: false
                    })
                }
            }
        });
    }
});