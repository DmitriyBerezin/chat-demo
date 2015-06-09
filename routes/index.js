var express = require('express');
var router = express.Router();
var WebSocketServer = new require('ws');

var clients = {};
var wsServer = new WebSocketServer.Server({
	port: 3001
});

wsServer.on('connection', function(ws) {
	var id = Math.random();
	clients[id] = ws;

	ws.on('message', function(message) {
		for (var key in clients) {
			clients[key].send(message);
		}
	});

	ws.on('close', function() {
		delete clients[id];
	});
});

router.get('/', function(req, res, next) {
	res.render('index');
});

module.exports = router;
