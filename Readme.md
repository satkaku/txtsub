# txtsub

txtsub is a Pub/sub for Node.js with text file.

## Example

```javascript
var client = require("./index.js");

var sub = client();
sub.subscribe("test.txt", function(data){
	console.log("alltext", data.raw);
	console.log("diff", data.diff);
});

var pub = client();
setTimeout(function(){
	pub.publish("test.txt", "hello");	// "sub hello"
}, 1000);
```

## Install
```
npm install txtsub
```

## Error Handling
```javascript
var client = client();
client.on("error", function(err){
	// some error
});
```