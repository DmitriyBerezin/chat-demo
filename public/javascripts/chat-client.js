
var MessageTypeCode = {
	MESSAGE: 'msg',
	TYPING_START: 'start_typing',
	TYPING_STOP: 'stop_typing',
	JOIN: 'join',
	LEAVE: 'leave'
};

document.addEventListener('DOMContentLoaded', function(evt) {
	var btnSend = document.getElementById('btnSend'),
		listMsg = document.querySelector('.messages-list'),
		txtMessage = document.getElementById('txtMessage'),
		isTyping = false,
		socket;

	if (!('WebSocket' in window || 'MozWebSocket' in window)) {
		console.log('Sorry, but you browser doesn\'t support WebSockets. Please, think to update them.');
		return;
	}

	var host = location.origin.replace(/^http/, 'ws');
	socket = new WebSocket(host);
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
		txtMessage.addEventListener('keypress', onKeyPress);
		txtMessage.addEventListener('keypress', debounce(onKeyPressDebounced, 1000));
	}

	function onSocketMessage(evt) {
		var data = JSON.parse(evt.data);

		data.date = moment(data.date).format('MMMM Do YYYY, h:mm:ss a');
		if (data.type === MessageTypeCode.MESSAGE) {
			renderMessage(tmplMessage(data), 'message', data.client_id);
		}
		else if (data.type === MessageTypeCode.TYPING_START) {
			renderMessage(tmplNotification(data), 'notif typing', data.client_id);
		}
		else if (data.type === MessageTypeCode.TYPING_STOP) {
			removeMessage('typing', data.client_id);
		}
		else {
			renderMessage(tmplNotification(data), 'notif', data.client_id);
		}
	}

	function renderMessage(html, className, client_id) {
		var li = document.createElement('li');

		li.className = className;
		li.dataset.client_id = client_id;
		li.innerHTML = html;
		listMsg.appendChild(li);
		// Scroll to the bottom of list
		listMsg.scrollTop = listMsg.scrollHeight;
	}

	function removeMessage(className, client_id) {
		var query = '.' + className + '[data-client_id="' + client_id + '"]',
			elem = document.querySelector(query);

		if (elem && elem.parentNode) {
			elem.parentNode.removeChild(elem);
			return true;
		}

		return false;
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

	function onKeyPress(evt) {
		if (isTyping) {
			return false;
		}

		isTyping = true;

		var message = {
			type: MessageTypeCode.TYPING_START
		};

		socket.send(JSON.stringify(message));
	}

	function onKeyPressDebounced(evt) {
		if (!isTyping) {
			return false;
		}

		isTyping = false;

		var message = {
			type: MessageTypeCode.TYPING_STOP
		};

		socket.send(JSON.stringify(message));
	}
});
