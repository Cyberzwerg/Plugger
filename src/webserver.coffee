express = require("express")
http = require("http")
remoteHandler=  require("./remoteHandler.js")
app = express()


app.post("/setManual/:homeCode/:deviceNumber/:state",(req,res) ->
	console.log "Got request"
	remoteHandler.setState(req.params.homeCode,req.params.deviceNumber,req.params.state)
	res.json 
		status: true
)


server = http.createServer(app).listen(process.env.port ? 80)
console.log "Server started"
