var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var express = require('express');
var users = [];
var ids = [];

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html'); // shows the complete pathname of index.html
});

app.use(express.static("public"));

io.on('connection', function (socket) { // This establish connection and can check who are connected
  socket.on('name entry', function (name) {
    var id = socket.id;
    if (!users.includes(name)) {
      ids.push(id);
      users.push(name);
    }
    io.emit('name entry', ids, users);
  })
  socket.on('chat message', function (msg) {
    io.emit('chat message', msg);
  });

  socket.on('typing', function(username) {
    socket.broadcast.emit('typing', username + " is typing...")
  })

  socket.on('private', function(id, message) {
    io.to(id).emit('private', id,  message)
  })

  socket.on("logout",function(user) {
    var index = users.indexOf(user);
    users.splice(index, 1);
    var id = ids[index];
    io.emit('logout', id);
  })
});
http.listen(port, function () {
  console.log('listening on *:' + port);
});