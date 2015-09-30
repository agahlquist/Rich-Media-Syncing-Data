var http = require('http');
var fs = require('fs');
var socketio = require('socket.io');

var port = process.env.PORT || process.env.NODE_PORT || 3000;

var index = fs.readFileSync(__dirname + '/../client.html');

function onRequest(request, response){
  response.writeHead(200, {"Content-Type": "text/html"});
  response.write(index);
  response.end();
}

var app = http.createServer(onRequest).listen(port);

console.log('listening on 127.0.0.1: ' + port);

var io = socketio(app);

var users = {};
var draws = {};

function onJoin(socket) {
  socket.on('join', function(data) {
    users[data.name] = data.name;
    
    var msg = {
      msg: "you have joined the server"
    };
    
    socket.emit('joined', msg);
    socket.name = data.name;
  });
}

function onDraw(socket) {
  socket.on('draw', function(data){
    if(draws[data.time] == undefined) {
      draws[data.time] = data;
      io.sockets.emit('drawlin', draws);
    }
  });
}

io.sockets.on('connection', function(socket) {
  onJoin(socket);
  onDraw(socket);
});