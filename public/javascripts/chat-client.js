
var socket = new WebSocket("ws://localhost:3001"),
	btnSend = document.getElementById('btnSend'),
	txtMessage = document.getElementById('txtMessage');

btnSend.addEventListener('click', onBtnSendClick);

function onBtnSendClick(evt) {
	var message = {
		text: txtMessage.value,
		date: new Date()
	};

	socket.send(JSON.stringify(message));

	txtMessage.value = '';
}

function renderMessage(message) {
	console.log(message);
}

socket.onmessage = function(evt) {
	renderMessage(JSON.parse(evt.data));
}