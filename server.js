const express = require('express');
const app = express();

app.use(express.static(__dirname));

console.clear();

// This server is used for debugging purposes.
// The webapp is hosted at https://benuthoff.github.io/Scrivi/
var server = app.listen(3000, function () {
	var host = 'localhost';
	var port = server.address().port;
	console.log()
	console.log('listening on http://'+host+':'+port+'/');
});