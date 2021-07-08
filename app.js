var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/',function(req, res){
    res.sendFile(__dirname + '/index.html');
});

var count=1;
io.on('connection', function(socket){
    console.log('user connected: ', socket.id);
    var name = "user" + count++;
    //io.to(socket.id).emit 을 사용하여 해당 socket.id에만 event를 전달
    io.to(socket.id).emit('change name',name);

    socket.on('disconnect', function(){
        console.log('user disconnected: ', socket.id);
    });

    socket.on('send message', function(name,text){
        var msg = name + ' : ' + text;
        console.log(msg);
        //io.emit 을 사용하여 모든 사용자에게 event를 전달
        io.emit('receive message', msg);
    });
});

http.listen(3000, function(){
    console.log('server on!');
});