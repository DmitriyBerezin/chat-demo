function tmplMessage(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (author, date, text) {
buf.push("<div class=\"message-user\">" + (jade.escape(null == (jade_interp = author) ? "" : jade_interp)) + "</div><div class=\"message-text\">" + (jade.escape(null == (jade_interp = text) ? "" : jade_interp)) + "</div><div class=\"message-date\">" + (jade.escape(null == (jade_interp = date) ? "" : jade_interp)) + "</div>");}.call(this,"author" in locals_for_with?locals_for_with.author:typeof author!=="undefined"?author:undefined,"date" in locals_for_with?locals_for_with.date:typeof date!=="undefined"?date:undefined,"text" in locals_for_with?locals_for_with.text:typeof text!=="undefined"?text:undefined));;return buf.join("");
}
function tmplNotification(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (date, text) {
buf.push("<div class=\"notif-text\">" + (jade.escape(null == (jade_interp = text) ? "" : jade_interp)) + "</div><div class=\"notif-date\">" + (jade.escape(null == (jade_interp = date) ? "" : jade_interp)) + "</div>");}.call(this,"date" in locals_for_with?locals_for_with.date:typeof date!=="undefined"?date:undefined,"text" in locals_for_with?locals_for_with.text:typeof text!=="undefined"?text:undefined));;return buf.join("");
}