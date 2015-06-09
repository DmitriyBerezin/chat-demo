var express = require('express');
var router = express.Router();
var WebSocketServer = new require('ws');

var clients = [],
	messages = [];

var wsServer = new WebSocketServer.Server({
	port: 3001
});

wsServer.on('connection', function(ws) {
	var id = clients.push(ws) - 1;

	ws.on('message', function(data) {
		var message = JSON.parse(data);

		message.author = id;
		messages.push(message);

		for (var i = 0, l = clients.length; i < l; ++i) {
			clients[i].send(JSON.stringify(message));
		}
	});

	ws.on('close', function() {
		clients.splice(id, 1);
	});
});

router.get('/', function(req, res, next) {
	res.render('index');
});

module.exports = router;
