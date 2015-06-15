
var ChatApp = (function(app) {
	'use strict';

	var	MessageTypeCode = {
		MESSAGE: 'msg',
		TYPING_START: 'start_typing',
		TYPING_STOP: 'stop_typing',
		JOIN: 'join',
		LEAVE: 'leave'
	};

	if (typeof exports !== 'undefined'){
		module.exports = {
			MessageTypeCode: MessageTypeCode
		};
	}
	else {
		app.MessageTypeCode = MessageTypeCode;
		return app;
	}

}(ChatApp || {}));