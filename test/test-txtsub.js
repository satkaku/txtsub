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
		setTimeout(function(){
			fs.writeFile(TXT_FILE, "hello", function(){});
		},500);
	})
	
});