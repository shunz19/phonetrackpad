var robot = require("robotjs");

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

http.listen(919, function(){
  console.log('listening on 919');
});

var currentpos = robot.getMousePos();
var screenSize = robot.getScreenSize();

io.on("connection", (socket) => {
	socket.on("start",data => {
		currentpos = robot.getMousePos();
	})
	socket.on("move",data=> {
		robot.moveMouse(currentpos.x + data.x, currentpos.y + data.y);
	})
	socket.on("ldown",() => {
		robot.mouseToggle("down");
	})
	socket.on("lup",() => {
		robot.mouseToggle("up");
	})
	socket.on("rdown",() => {
		robot.mouseToggle("down","right")
	})
	socket.on("rup", () => {
		robot.mouseToggle("up","right");
	})
	socket.on("key", key => {
		if(key == "") return;
		try {
			robot.keyTap(key);
		}
		catch(e) {}
	})
	socket.on("log", data => {
		console.log(data);
	})
	socket.on("abso", data => {
		robot.moveMouse(screenSize.width * data.x, screenSize.height * data.y);
	})
})

app.get("/", (req,res) => {
	res.sendFile(__dirname + "/index.html")
})

app.get("/abso", (req,res) => {
	res.sendFile(__dirname + "/abso.html")
})
