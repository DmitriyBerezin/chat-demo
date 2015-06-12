var util = require('util'),
	faker = require('faker'),
	msgTypes = require('./public/javascripts/messages-types'),
	WebSocketServer = new require('ws'),
	wsServer;

function sendToClients(clients, text, type, client_id, client_name) {
	var message = {
		type: type,
		text: text,
		client_id: client_id,
		client_name: client_name,
		date: new Date()
	};

	sendMessage(clients, message);

	return message;
}

function sendMessage(clients, message) {
	for (var i = 0, l = clients.length; i < l; ++i) {
		clients[i].send(JSON.stringify(message), function(err) {
			if (err) {
				console.log('Error has occured in message sending');
			}
		});
	}
}

function startWsServer(server) {
	var wsServer,
		clients = [],
		messages = [];

	wsServer = new WebSocketServer.Server({
		server: server
	});

	wsServer.on('connection', function(ws) {
		var id = clients.push(ws) - 1,
			name = faker.name.findName(),
			text = util.format('%s joined chat room', name);

		sendToClients(clients, text, msgTypes.MessageTypeCode.JOIN, id, name);

		ws.on('message', function(data) {
			var message = JSON.parse(data);

			if (message.type === 'start_typing') {
				var text = util.format('%s is typing...', name);
				sendToClients(clients, text, msgTypes.MessageTypeCode.TYPING_START, id, name);
			}
			else if (message.type === 'stop_typing') {
				sendToClients(clients, null, msgTypes.MessageTypeCode.TYPING_STOP, id, name);
			}
			else {
				var msg = sendToClients(clients, message.text, msgTypes.MessageTypeCode.MESSAGE, id, name);
				messages.push(msg);
			}
		});

		ws.on('close', function() {
			var text = util.format('%s left chat room', name);
			sendToClients(clients, text, msgTypes.MessageTypeCode.LEAVE, id, name);

			clients.splice(id, 1);
		});
	});
}

module.exports = {
	start: startWsServer
};
