(function() {
  var db, nedb, remoteHandler;

  nedb = require("nedb");

  remoteHandler = require("./remoteHandler.js");

  db = new nedb({
    filename: "./devices.db",
    autoload: true
  });

  exports.getDevices = function(callback) {
    return db.find({}, function(err, docs) {
      return callback(docs != null ? docs : []);
    });
  };

  exports.addDevice = function(data, callback) {
    if ((data.name != null) && (data.homeCode != null) && (data.deviceNumber != null)) {
      return db.insert({
        name: data.name,
        homeCode: data.homeCode,
        deviceNumber: data.deviceNumber,
        status: false,
        schedules: []
      }, function(err) {
        return callback(err == null);
      });
    } else {
      return callback(false);
    }
  };

  exports.removeDevice = function(id, callback) {
    return db.remove({
      _id: id
    }, function(err) {
      return callback(err == null);
    });
  };

  exports.setDeviceStatus = function(id, status, callback) {
    return db.findOne({
      _id: id
    }, function(err, device) {
      if ((err == null) && (device != null)) {
        db.update({
          _id: id
        }, {
          $set: {
            status: status
          }
        }, function(err) {
          return console.log(err);
        });
        remoteHandler.setState(device.homeCode, device.deviceNumber, status);
        return callback(true);
      } else {
        return callback(false);
      }
    });
  };

  exports.toggleDeviceStatus = function(id, callback) {
    return db.findOne({
      _id: id
    }, function(err, device) {
      if ((err == null) && (device != null)) {
        return exports.setDeviceStatus(id, !device.status, callback);
      } else {
        return callback(false);
      }
    });
  };

}).call(this);
