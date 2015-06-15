
var ChatApp = (function(app) {
	'use strict';

	var _socket,
		_options;

	function start(options) {
		if (!('WebSocket' in window || 'MozWebSocket' in window)) {
			throw new Error('Sorry, but you browser doesn\'t support WebSockets. Please, update it.');
		}

		_options = options;

		var host = location.origin.replace(/^http/, 'ws');
		_socket = new WebSocket(host);
		_socket.onerror = onSocketError;
		_socket.onclose = onSocketClose;
		_socket.onopen = onSocketOpen;
		_socket.onmessage = onSocketMessage;
	}

	function onSocketOpen(evt) {
		// We are ready for sending messages
		if (typeof _options.onStart === 'function') {
			_options.onStart();
		}
	}

	function onSocketClose(evt) {
		var isNormalReason = evt.code === 1000;
		if (typeof _options.onClose === 'function') {
			_options.onClose(isNormalReason);
		}
	}

	function onSocketError(evt) {
		if (typeof _options.onError === 'function') {
			_options.onError();
		}
	}

	function onSocketMessage(evt) {
		var data = JSON.parse(evt.data);

		data.date = moment(data.date).format('MMMM Do YYYY, h:mm:ss a');
		if (typeof _options.onMessage === 'function') {
			_options.onMessage(data);
		}
	}

	function send(data) {
		_socket.send(JSON.stringify(data));
	}

	// Public API
	app.start = start;
	app.send = send;

	return app;
}(ChatApp || {}));
