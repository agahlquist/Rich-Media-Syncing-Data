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

var num = 0;

function onUpdate(socket){
  socket.on('updateNum', function(data){
    num += data.message;
    
    io.sockets.emit('updatePara', num);
  });
}

io.sockets.on('connection', function(socket){
  onUpdate(socket);
});