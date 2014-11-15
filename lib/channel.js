var Emitter = require("events").EventEmitter;
var inherits = require("inherits");
var fs = require("fs");

module.exports = Channel;

function Channel(opts) {
	this.file = opts.file || '';
	this.content = "";
	this.watch = null;
}
inherits(Channel, Emitter);

Channel.prototype.listen = function() {
	var self = this;
	self.watch = fs.watch(self.file, function(event, filename){
	
		self.get(function(err, content){
			if (err) { return self.error(err); }
			if (content === self.content) {
				return;
			}
			self.content = content;
			self.emit( "change", self.content );
		})

	});
};
Channel.prototype.close = function() {
	self.watch.close();
};
Channel.prototype.get = function(callback) {
	fs.readFile(this.file, function(err, file){
		if (err) { return self.error(err); }
		callback(err, file.toString());
	});
};
Channel.prototype.error = function(err) {
	this.emit("error", err);
};