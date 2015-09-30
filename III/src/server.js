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

function onJoin(socket) {
  socket.on('join', function(data) {
    users[data.name] = data;
    socket.name = data.name;
    
    console.log(socket.name + ' has entered the building.');
    socket.emit('joined', data.name + ', congrats! You joined the server.');
  });
}

function onDraw(socket) {
  socket.on('drawRequest', function(data) {
    io.sockets.emit('draw', data);
  });
}

function onDC(socket) {
  socket.on('disconnect', function(data) {
    console.log(socket.name + ' has left the building.')
    io.sockets.emit('dc', socket.name);
    delete users[socket.name];
  });
}

io.sockets.on('connection', function(socket) {
  onJoin(socket);
  onDraw(socket);
  onDC(socket);
});