var Emitter = require("events").EventEmitter;
var inherits = require("inherits");
var fs = require("fs");
var jsdiff = require("diff");

module.exports = Channel;

function Channel(opts) {
	this.file = opts.file || '';
	this.content = "";
	this.watch = null;
}
inherits(Channel, Emitter);

Channel.prototype.listen = function() {
	try {
		this.watch = fs.watch(this.file, this.onChange.bind(this) );

	} catch(err) {
		this.emit("error", err);
	}
	
};
Channel.prototype.onChange = function(event, filename) {
	var self = this;
	self.getContent(function(err, content){
		if (err) { return self.error(err); }
		if (content === self.content) {
			return;
		}

		diffs = jsdiff.diffChars(self.content, content);
		self.content = content;
		self.emit( "change", {
			raw: self.content,
			diff: diffs
		});
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