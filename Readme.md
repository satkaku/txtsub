# txtsub

txtsub is a pub/sub implementation for dummy of pub/sub (for example Redis).

## Example

```javascript
var client = require("./index.js");

var sub = client();
sub.subscribe("test.txt", function(data){
	console.log("sub", data);
});

var pub = client();
setTimeout(function(){
	pub.publish("test.txt", "hello");	// "sub hello"
}, 1000);
```