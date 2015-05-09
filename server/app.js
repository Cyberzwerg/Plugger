var app, exec, express, http, server;

express = require("express");

http = require("http");

exec = require('child_process').exec;

app = express();

server = http.createServer(app).listen(8080);

var que = [];
// This is not secure for use outside your local network as somebody could inject another command via the params..
// make sure to take measures against that if you want to control your stuff over the internet
app.post("/setDeviceStatus/:homeCode/:deviceNumber/:state", function(req, res) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  que.push("~/raspberry-remote/send " + req.params.homeCode + " " + req.params.deviceNumber + " " + req.params.state);
  return res.json({
    status: true
  });
});

setInterval( function(){

  exec(que[0]);
  que.shift();

},300);
