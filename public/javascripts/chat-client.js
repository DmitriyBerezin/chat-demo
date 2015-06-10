
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

		data.date = moment(data.date).format('MMMM Do YYYY, h:mm:ss a');
		if (data.type === MessageTypeCode.MESSAGE) {
			renderMessage(tmplMessage(data), 'message');
		}
		else if (data.type === MessageTypeCode.NOTIFICATION) {
			renderMessage(tmplNotification(data), 'notif');
		}
	}


	function onBtnSendClick(evt) {
		var message = {
			text: txtMessage.value,
			date: new Date()
		};

		socket.send(JSON.stringify(message));

		txtMessage.value = '';
		txtMessage.focus();
	}

	function renderMessage(html, className) {
		var li = document.createElement('li');

		li.className = className;
		li.innerHTML = html;
		listMsg.appendChild(li);
		// Scroll to the bottom of list
		listMsg.scrollTop = listMsg.scrollHeight;
	}
});
