var express = require('express');
var ejs = require('ejs');
var app = express();

app.get('/', function(request, response) {
	response.render(__dirname + '/peg_game.html');
});

var server = app.listen(process.env.PORT || 5000, function () {
	console.log("Server is running on localhost:%s", server.address().port);
	app.engine('html', ejs.renderFile);
	app.set('view engine', 'html'); 
	app.use(express.static(__dirname));
});
