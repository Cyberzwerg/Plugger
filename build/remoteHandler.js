(function() {
  var exec, que, sendLocation;

  exec = require("child_process").exec;

  sendLocation = "~/raspberry-remote/send";

  que = [];

  exports.setState = function(homeCode, deviceNumber, state) {
    return que.push({
      homeCode: homeCode,
      deviceNumber: deviceNumber,
      state: state === "on" ? 1 : 0
    });
  };

  setInterval(function() {
    var item, query;
    if (que.length > 0) {
      item = que[0];
      query = sendLocation + " " + item.homeCode + " " + item.deviceNumber + " " + item.state;
      exec(query);
      console.log(query);
      return que.shift();
    }
  }, 300);

}).call(this);
