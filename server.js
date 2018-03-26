var express= require('express');
var app=express();
var server=require('http').createServer(app);
var io=require('socket.io').listen(server);

users=[];
connections=[];

server.listen(process.env.PORT || 8182);
console.log("server running on 8182");


app.get('/', (req, res) => {
  res.sendFile(__dirname, '/index.html');
});


io.sockets.on('connection', function(socket){

connections.push(socket);
console.log('Status: %s sockets connected', connections.length);

// disconnect
socket.on('disconnect', function(data){

    users.splice(users.indexOf(socket.username),1);
    updateusername();
 connections.splice(connections.indexOf(socket),1);
 console.log('Status: %s sockets connected', connections.length);
});
// send message

socket.on('send message', function(data){
    
    io.sockets.emit('new message', {msg: data , user: socket.username});
});

socket.on('new message', function(data,callback){
    callback(true);
    socket.username=data;
    users.push(socket.username);
    updateusername();
    
    
});

function updateusername()
{
     io.sockets.emit('get users', users);
}

});