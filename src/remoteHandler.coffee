# Remote handler for Plugger server. This acts as the link between the server and the RaspberryPi

exec = require("child_process").exec 

sendLocation = "~/raspberry-remote/send"
que = []


exports.setState = (homeCode,deviceNumber,state) ->

	que.push(
		homeCode: homeCode 
		deviceNumber: deviceNumber	
		state:  if state == "on" then 1 else 0
	)


setInterval( ->
	if que.length > 0
		item = que[0]
		query = "#{sendLocation} #{item.homeCode} #{item.deviceNumber} #{ item.state }"
		exec(query)
		console.log query
		que.shift()

,300)
