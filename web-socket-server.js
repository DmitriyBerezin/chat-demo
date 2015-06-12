var util = require('util'),
	faker = require('faker'),
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
				console.log('Error us occured on message send');
			}
		});
	}
}

module.exports = {
	start: function(server) {
		var wsServer,
			clients = [],
			messages = [];

		wsServer = new WebSocketServer.Server({
			server: server
		});

		wsServer.on('connection', function(ws) {
			var id = clients.push(ws) - 1,
				name = faker.name.findName(),
				text = util.format('%s join chat room', name);

			sendToClients(clients, text, 'join', id, name);

			ws.on('message', function(data) {
				var message = JSON.parse(data);

				if (message.type === 'start_typing') {
					var text = util.format('%s is typing', name);
					sendToClients(clients, text, 'start_typing', id, name);
				}
				else if (message.type === 'stop_typing') {
					sendToClients(clients, null, 'stop_typing', id, name);
				}
				else {
					var msg = sendToClients(clients, message.text, 'msg', id, name);
					messages.push(msg);
				}
			});

			ws.on('close', function() {
				var text = util.format('%s leave chat room', name);
				sendToClients(clients, text, 'leave', id, name);

				clients.splice(id, 1);
			});
		});
	}
};
