var express = require('express');
var router = express.Router();
var WebSocketServer = new require('ws');
var util = require('util');

var clients = [],
	messages = [];

var wsServer = new WebSocketServer.Server({
	port: 3001
});

wsServer.on('connection', function(ws) {
	var id = clients.push(ws) - 1;

	var text = util.format('%s join chat room', id);
	sendNotification(clients, text);

	ws.on('message', function(data) {
		var message = JSON.parse(data);

		message.author = id;
		message.type = 'msg';
		messages.push(message);

		sendToClients(clients, message);
	});

	ws.on('close', function() {
		clients.splice(id, 1);

		var text = util.format('%s leave chat room', id);
		sendNotification(clients, text);
	});
});

function sendNotification(clietns, text) {
	var notification = {
		type: 'notif',
		text: text,
		date: new Date()
	};

	sendToClients(clients, notification);
}

function sendToClients(clients, message) {
	for (var i = 0, l = clients.length; i < l; ++i) {
		clients[i].send(JSON.stringify(message), function(err) {
			if (err) {
				console.log('Error us occured on message send');
			}
		});
	}
}

router.get('/', function(req, res, next) {
	res.render('index');
});

module.exports = router;
