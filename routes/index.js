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
	sendToClients(clients, text, 'join', id);

	ws.on('message', function(data) {
		var message = JSON.parse(data);

		if (message.type === 'start_typing') {
			var text = util.format('%s is typing', id);
			sendToClients(clients, text, 'start_typing', id);
		}
		else if (message.type === 'stop_typing') {
			sendToClients(clients, null, 'stop_typing', id);
		}
		else {
			var msg = sendToClients(clients, message.text, 'msg', id);
			messages.push(msg);
		}
	});

	ws.on('close', function() {
		clients.splice(id, 1);

		var text = util.format('%s leave chat room', id);
		sendToClients(clients, text, 'leave', id);
	});
});

function sendToClients(clients, text, type, client_id) {
	var message = {
		type: type,
		text: text,
		client_id: client_id,
		date: new Date()
	};

	sendMessage(clients, message);

	return message;
}

function sendMessage(clients, message) {
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
