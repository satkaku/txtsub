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

	try {
		self.watch = fs.watch(self.file, function(event, filename){
			self.onChange.call(self, event, filename);
		});

	} catch(err) {
		self.emit("error", err);
	}
	
};
Channel.prototype.onChange = function(event, filename) {
	var self = this;
	self.getContent(function(err, content){
		if (err) { return self.error(err); }
		if (content === self.content) {
			return;
		}
		self.content = content;
		self.emit( "change", self.content );
	})
};
Channel.prototype.getContent = function(callback) {
	var self = this;
	fs.readFile(self.file, function(err, file){
		if (err) { return self.error(err); }
		callback(err, file.toString());
	});
};
Channel.prototype.close = function() {
	this.watch.close();
};
Channel.prototype.error = function(err) {
	this.emit("error", err);
};