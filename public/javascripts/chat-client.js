
var socket = new WebSocket("ws://localhost:3001"),
	btnSend = document.getElementById('btnSend'),
	txtMessage = document.getElementById('txtMessage');

btnSend.addEventListener('click', onBtnSendClick);

function onBtnSendClick(evt) {
	socket.send(txtMessage.value);

	txtMessage.value = '';
}

socket.onmessage = function(evt) {
	console.log(evt);
}