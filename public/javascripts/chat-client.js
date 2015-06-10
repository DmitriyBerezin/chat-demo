
var socket = new WebSocket("ws://localhost:3001"),
	btnSend = document.getElementById('btnSend'),
	listMsg = document.querySelector('.messages-list'),
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
	var html = window.message(message),
		li = document.createElement('li');

	li.className = 'message';
	li.innerHTML = html;
	listMsg.appendChild(li);
}

socket.onmessage = function(evt) {
	renderMessage(JSON.parse(evt.data));
}