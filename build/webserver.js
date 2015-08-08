(function() {
  var app, express, http, ref, remoteHandler, server;

  express = require("express");

  http = require("http");

  remoteHandler = require("./remoteHandler.js");

  app = express();

  app.post("/setManual/:homeCode/:deviceNumber/:state", function(req, res) {
    console.log("Got request");
    remoteHandler.setState(req.params.homeCode, req.params.deviceNumber, req.params.state);
    return res.json({
      status: true
    });
  });

  server = http.createServer(app).listen((ref = process.env.port) != null ? ref : 80);

  console.log("Server started");

}).call(this);
