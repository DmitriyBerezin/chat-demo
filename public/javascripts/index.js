
document.addEventListener('DOMContentLoaded', function(evt) {
	'use strict';
	
	var btnSend = document.getElementById('btnSend'),
		listMsg = document.querySelector('.messages-list'),
		txtMessage = document.getElementById('txtMessage'),
		errorMessage = document.querySelector('.error-message'),
		isTyping = false;

	try {
		ChatApp.start({
			onStart: onAppStart,
			onClose: onAppClose,
			onMessage: onAppMessage,
			onError: onAppError
		});
	}
	catch (ex) {
		showError(ex.message);
	}


	function onAppError(evt) {
		showError('Error has occured in message sending');
	}

	function onAppClose(isNormalReason) {
		if (!isNormalReason) {
			showError('Socket was closed abnormally. Please, try to refresh page.');
		}
	}

	function onAppStart(evt) {
		btnSend.addEventListener('click', onBtnSendClick);
		txtMessage.addEventListener('keypress', onKeyPress);
		txtMessage.addEventListener('keypress', debounce(onKeyPressDebounced, 1000));
	}

	function onAppMessage(data) {
		if (data.type === ChatApp.MessageTypeCode.MESSAGE) {
			renderMessage(tmplMessage(data), 'message', data.client_id);
		}
		else if (data.type === ChatApp.MessageTypeCode.TYPING_START) {
			renderMessage(tmplNotification(data), 'notif typing', data.client_id);
		}
		else if (data.type === ChatApp.MessageTypeCode.TYPING_STOP) {
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

	function sendMessage() {
		var message = {
			text: txtMessage.value,
			date: new Date()
		};

		ChatApp.send(message);

		txtMessage.value = '';
		txtMessage.focus();
	}

	function showError(errMsg) {
		errorMessage.innerHTML = errMsg;
		errorMessage.style.display = 'inline-block';
	}

	function startTyping() {
		if (isTyping) {
			return false;
		}

		isTyping = true;

		var message = {
			type: ChatApp.MessageTypeCode.TYPING_START
		};

		ChatApp.send(message);
	}

	function stopTyping() {
		if (!isTyping) {
			return false;
		}

		isTyping = false;

		var message = {
			type: ChatApp.MessageTypeCode.TYPING_STOP
		};

		ChatApp.send(message);
	}

	function onBtnSendClick(evt) {
		sendMessage();
	}

	function onKeyPress(evt) {
		if (evt.which === 13) {
			sendMessage();
			stopTyping();
			
			return false;
		}

		return startTyping();
	}

	function onKeyPressDebounced(evt) {
		stopTyping();
	}
});
