var Channel = require("./lib/channel.js");
var fs = require("fs");

module.exports = Client;

function Client(opts) {
	if (!(this instanceof Client)) return new Client();
	this.channels = {};
}
Client.prototype.publish = function(file, str) {

	fs.writeFile(file, str, function(err){
		console.log("write");
	});

};
Client.prototype.subscribe = function(file, callback) {
	var ch = new Channel({ file: file });
	ch.on("change", function(content){
		callback(content);
	});
	ch.listen();
	this.channels[file] = ch;
};
Client.prototype.unsubscribe = function(file) {
	this.channels[file].close();
};
