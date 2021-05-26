var http = require("http");
var fs = require("fs");
var url = require("url");
var path = require("path");
var mime = require("mime");

var handler = function (req, res) {
	var dir = "/";
	var uri = url.parse(req.url).pathname;
	var filename = path.join(dir, uri);
	if (filename == "/") {
		filename = "/index.html";
	}
	fs.readFile(__dirname + filename, function (err, data) {
		if (err) {
			res.writeHead(500);
			res.end("Error loading " + uri);
			return;
		}	
		res.setHeader('Content-Type', mime.getType(filename));
		res.writeHead(200);
		res.end(data);
	});
}

http.createServer(handler).listen(8888);
