const express = require('express')
const app = express()

app.use(express.static(__dirname))

var server = app.listen(3000, function () {
    var host = 'localhost';
    var port = server.address().port;
    console.log('listening on http://'+host+':'+port+'/');
});