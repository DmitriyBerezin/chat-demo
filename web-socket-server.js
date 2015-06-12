var chatServer = require('./chat-server'),
	WebSocketServer = new require('ws'),
	wsServer;

function startWsServer(server) {
	wsServer = new WebSocketServer.Server({
		server: server
	});

	wsServer.on('connection', function(ws) {
		var client = chatServer.addClient(ws);

		ws.on('message', function(data) {
			chatServer.recieveMessage(data, client);
		});

		ws.on('close', function() {
			chatServer.removeClient(client);
		});
	});
}

module.exports = {
	start: startWsServer
};
