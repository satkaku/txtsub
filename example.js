var client = require("./index.js");

var sub = client();
sub.subscribe("test.txt", function(data){
	console.log("sub", data);
});

var pub = client();
setTimeout(function(){
	pub.publish("test.txt", "hello");
}, 1000);
