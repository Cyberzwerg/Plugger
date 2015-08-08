nedb = require("nedb")
remoteHandler=  require("./remoteHandler.js")
db = new nedb(
		filename: "./devices.db"
		autoload: true
	)

exports.getDevices = (callback) ->

	db.find({}, (err,docs) ->
		# Who needs error handling anyways? :P
		callback(docs ? [])
	)

exports.addDevice = (data,callback) ->

	if data.name? and data.homeCode? and data.deviceNumber? 

		db.insert(
			name: data.name
			homeCode: data.homeCode
			deviceNumber: data.deviceNumber
			status: false
			schedules: []
		, (err) ->
			# Fany as fuck
			callback(!err?)
		)
	else 
		callback false

exports.removeDevice = (id,callback) ->
	db.remove({ _id: id}, (err) ->
		callback(!err?)
	)

exports.setDeviceStatus = (id,status,callback) ->

	db.findOne(
		_id: id 
	, (err,device) ->
		if not err? and device?
			db.update({ _id: id }, { $set: { status: status}}, (err) ->
				console.log err
			)
			remoteHandler.setState(device.homeCode,device.deviceNumber,status)
			callback(true)
		else
			callback(false)
	)


exports.toggleDeviceStatus = (id,callback) ->
	db.findOne(
		_id: id 
	, (err,device) ->
		if not err? and device?

			exports.setDeviceStatus(id,!device.status,callback)
		else
			callback(false)
	)
