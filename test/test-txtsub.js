var should  = require("should");
var fs 		= require("fs");
var client  = require("../index.js");

var TXT_FILE = "test/test.txt";

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
			should(content).equal("hello");
			sub.unsubscribe(TXT_FILE);
			done();
		});
		delayWrite("hello");
	})

	it("if file isn't exists, notify subscriber error", function(done){
		var sub = client();
		sub.on("error", function(err){
			done();
		});
		sub.subscribe("invalid.txt", function(content){});
		delayWrite("hello");
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

function delayWrite(txt) {
	setTimeout(function(){
		fs.writeFile(TXT_FILE, txt, function(){});
	},500);
}