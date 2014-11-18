var should  = require("should");
var fs 		= require("fs");
var async 	= require("async");
var client  = require("../index.js");

var TXT_FILE = "test/test.txt";

describe("onready", function(){
	beforeEach(function (done) {
		fs.writeFile(TXT_FILE, "ignore", function(){ done(); });
	});
	afterEach(function (done) {
		fs.unlink(TXT_FILE, function(){ done(); });
	});

	it("That contents before watch, is ignored in diff", function(done){
		var sub = client();
		sub.subscribe(TXT_FILE, function(content){
			content.diff.forEach(function(each){
				if (each.added) {
					each.value.should.equal("add");
					sub.unsubscribe(TXT_FILE);
					done();
				}
			});
		});

		delayWrite("add");
	})

});


describe("subscribe", function(){

	beforeEach(function (done) {
		fs.writeFile(TXT_FILE, "", function(){ done(); });
	});
	afterEach(function (done) {
		fs.unlink(TXT_FILE, function(){ done(); });
	});

	it("if file change, notify subscriber its content", function(done){
		var sub = client();
		sub.subscribe(TXT_FILE, function(content){
			content.raw.should.equal("hello");
			sub.unsubscribe(TXT_FILE);
			done();
		});
		delayWrite("hello");
	});

	it("if file isn't exists, notify subscriber error", function(done){
		var sub = client();
		sub.on("error", function(err){
			done();
		});
		sub.subscribe("invalid.txt", function(content){});
		delayWrite("hello");
	});

	it("if file change, subscriber can get diff", function(done){
		var sub = client();
		var count = 0;
		sub.subscribe(TXT_FILE, function(content){

			if (count === 0) {
				content.raw.should.equal("diff");
			}
			if (count === 1) {
				content.raw.should.equal("diffadd");
				content.diff.forEach(function(each){
					if (each.added) {
						each.value.should.equal("add");
						sub.unsubscribe(TXT_FILE);
						done();
					}
				});
			}

			count++;
		});
		
		var pub = client();
		setTimeout(function(){
			pub.publish(TXT_FILE, "diff", function(){
				pub.publish(TXT_FILE, "add", function(){});
			});
		}, 300);
		
	});
});

describe("publish", function(){
	beforeEach(function (done) {
		fs.writeFile(TXT_FILE, "", function(){ done(); });
	});
	afterEach(function (done) {
		fs.unlink(TXT_FILE, function(){ done(); });
	});

	it("can write content to text file", function(done){
		var pub = client();
		pub.publish(TXT_FILE, "hello", function(){
			fs.readFile(TXT_FILE, function(err, file){
				"hello".should.equal( file.toString() );
				done();
			});
		})
	});
	it("can append content to text file", function(done){
		var pub = client();
		pub.publish(TXT_FILE, "hello", function(){
			pub.publish(TXT_FILE, "world", function(){
				fs.readFile(TXT_FILE, function(err, file){
					"helloworld".should.equal( file.toString() );
					done();
				});
			});
			
		})
	});
});

function delayWrite(txt, time) {
	time = time || 500;
	setTimeout(function(){
		fs.writeFile(TXT_FILE, txt, function(){});
	},time);
}