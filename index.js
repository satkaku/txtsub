var Channel = require("./lib/channel.js");
var Emitter = require("events").EventEmitter;
var inherits = require("inherits");
var fs = require("fs");

module.exports = Client;

function Client(opts) {
	if (!(this instanceof Client)) return new Client();
	this.channels = {};
}
inherits(Client, Emitter);

Client.prototype.publish = function(file, str, callback) {
	var self = this;
	fs.appendFile(file, str, function(err){
		if (err) { return self.error(err); }
		if (callback) { callback(); }
	});

};
Client.prototype.subscribe = function(file, callback) {
	var self = this;

	var ch = new Channel({ file: file });
	ch.on("change", function(content){
		callback(content);
	});
	ch.on("error", function(err){
		self.error(err);
	});
	ch.listen();
	this.channels[file] = ch;
};
Client.prototype.unsubscribe = function(file) {
	this.channels[file].close();
};
Client.prototype.error = function(err) {
	this.emit("error", err);
};