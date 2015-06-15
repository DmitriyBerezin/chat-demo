'use strict';

var util = require('util'),
	faker = require('faker'),
	msgTypes = require('./public/javascripts/messages-types'),
	clients = [],
	messages = [];


function sendMessage(clients, text, type, client) {
	var message = {
		type: type,
		text: text,
		client_id: client.id,
		client_name: client.name,
		date: new Date()
	};

	for (var i = 0, l = clients.length; i < l; ++i) {
		clients[i].send(JSON.stringify(message), function(err) {
			if (err) {
				console.log('Error has occured in message sending');
			}
		});
	}

	return message;
}

function recieveMessage(data, client) {
	var message = JSON.parse(data),
		text,
		msg;

	if (message.type === msgTypes.MessageTypeCode.TYPING_START) {
		text = util.format('%s is typing...', client.name);

		sendMessage(clients, text, msgTypes.MessageTypeCode.TYPING_START, client);
	}
	else if (message.type === msgTypes.MessageTypeCode.TYPING_STOP) {
		sendMessage(clients, null, msgTypes.MessageTypeCode.TYPING_STOP, client);
	}
	else {
		var msg = sendMessage(clients, message.text, msgTypes.MessageTypeCode.MESSAGE, client);

		messages.push(msg);
	}
}

function addClient(socket) {
	var client = {
			id: clients.push(socket) - 1,
			name: faker.name.findName()
		},
		text = util.format('%s joined chat room', client.name);

	sendMessage(clients, text, msgTypes.MessageTypeCode.JOIN, client);

	return client;
}

function removeClient(client) {
	var text = util.format('%s left chat room', client.name);
	
	sendMessage(clients, text, msgTypes.MessageTypeCode.LEAVE, client);

	clients.splice(client.id, 1);
}

module.exports = {
	addClient: addClient,
	removeClient: removeClient,
	sendMessage: sendMessage,
	recieveMessage: recieveMessage
};
