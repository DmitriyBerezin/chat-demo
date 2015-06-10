
var MessageTypeCode = {
	MESSAGE: 'msg',
	NOTIFICATION: 'notif'
};

document.addEventListener('DOMContentLoaded', function(evt) {
	var btnSend = document.getElementById('btnSend'),
		listMsg = document.querySelector('.messages-list'),
		txtMessage = document.getElementById('txtMessage'),
		socket;

	if (!('WebSocket' in window || 'MozWebSocket' in window)) {
		console.log('Sorry, but you browser doesn\'t support WebSockets. Please, think to update them.');
		return;
	}

	socket = new WebSocket("ws://localhost:3001");
	socket.onerror = onSocketError;
	socket.onclose = onSocketClose;
	socket.onopen = onSocketOpen;
	socket.onmessage = onSocketMessage;


	function onSocketError(evt) {
		console.error('Error is occured during socket connection');
	}

	function onSocketClose(evt) {
		if (evt.code !== 1000) {
			console.log('Socket was closed abnormally. The reason is: ', evt.reason);
		}
	}

	function onSocketOpen(evt) {
		// We are ready for sending messages
		btnSend.addEventListener('click', onBtnSendClick);	
	}

	function onSocketMessage(evt) {
		var data = JSON.parse(evt.data);

		console.log(data);
		if (data.type === MessageTypeCode.MESSAGE) {
			renderMessage(data);
		}
		else if (data.type === MessageTypeCode.NOTIFICATION) {
			renderNotification(data);
		}
	}


	function onBtnSendClick(evt) {
		var message = {
			text: txtMessage.value,
			date: new Date()
		};

		socket.send(JSON.stringify(message));

		txtMessage.value = '';
	}

	function renderMessage(message) {
		var html = tmplMessage(message),
			li = document.createElement('li');

		li.className = 'message';
		li.innerHTML = html;
		listMsg.appendChild(li);
	}

	function renderNotification(notification) {
		var html = tmplNotification(notification),
			li = document.createElement('li');

		li.className = 'notif';
		li.innerHTML = html;
		listMsg.appendChild(li);
	}
});
