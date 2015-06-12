var util = require('util'),
	WebSocketServer = new require('ws'),
	wsServer;

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
				text = util.format('%s join chat room', id);

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
				var text = util.format('%s leave chat room', id);
				sendToClients(clients, text, 'leave', id);

				clients.splice(id, 1);
			});
		});
	}
};
