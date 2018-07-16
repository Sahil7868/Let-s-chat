var express= require('express');
var app=express();
var server=require('http').createServer(app);
var io=require('socket.io').listen(server);
var nsp=io.of('/abc');
var username;
var zone;
users=[];
connections=[];

server.listen(process.env.PORT || 8182);
console.log("server running on 8182");

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

var userslist={
    'General':[],
    'Cricket':[],
    'Football':[],
    'Hockey':[],
    'Engineer':[],
    'Doctor':[],
    'Lawyer':[],
    'Manager':[],
    'Current-Affairs':[],
    'Over-Seas':[]
}
nsp.on('connection', function(socket){

connections.push(socket);
//console.log('Status: %s sockets connected', connections.length);

// disconnect
socket.on('disconnect', function(data){

   // console.log(userslist[zone]);
//delete userslist.zone[username];
   //users.splice(users.indexOf(username),1);
   var datalist=userslist[socket.zone];
  
    datalist.splice(datalist.indexOf(socket.username),1); 
  updateusername(socket.zone);
 connections.splice(connections.indexOf(socket),1);

 

 //console.log('Status: %s sockets connected', connections.length);
});
// send message

socket.on('send message', function(data,room){
   
    nsp.to(room).emit('new message', {msg: data ,user:socket.username});
    
    //io.sockets.emit('new message', {msg: data , user: socket.username});
});

socket.on('new message', function(data,interest,callback){

    callback(true);
   
   //  console.log(data)
   socket.username=data;
   socket.zone=interest;
   socket.join(interest);
    userslist[interest].push(socket.username);
    updateusername(socket.zone);
    
    
});

function updateusername(room)
{
    
     nsp.to(room).emit('get users',userslist[room]);
}

});