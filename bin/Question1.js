#!/usr/bin/env node

/**
 * Module dependencies.
 */

 var app = require('../app');
 var debug = require('debug')('Chat_App_Server:server');
 var http = require('http');
 
 /**
  * Get port from environment and store in Express.
  */
 
 var port = normalizePort(process.env.PORT || '3000');
 app.set('port', port);
 
 /**
  * Create HTTP server.
  */
 
 var server = http.createServer(app);
 
 /**
  * Listen on provided port, on all network interfaces.
  */
 
 server.listen(port);
 server.on('error', onError);
 server.on('listening', onListening);
 
 /**
  * Normalize a port into a number, string, or false.
  */
 
 function normalizePort(val) {
   var port = parseInt(val, 10);
 
   if (isNaN(port)) {
     // named pipe
     return val;
   }
 
   if (port >= 0) {
     // port number
     return port;
   }
 
   return false;
 }
 
 /**
  * Event listener for HTTP server "error" event.
  */
 
 function onError(error) {
   if (error.syscall !== 'listen') {
     throw error;
   }
 
   var bind = typeof port === 'string'
     ? 'Pipe ' + port
     : 'Port ' + port;
 
   // handle specific listen errors with friendly messages
   switch (error.code) {
     case 'EACCES':
       console.error(bind + ' requires elevated privileges');
       process.exit(1);
       break;
     case 'EADDRINUSE':
       console.error(bind + ' is already in use');
       process.exit(1);
       break;
     default:
       throw error;
   }
 }
 
 /**
  * Event listener for HTTP server "listening" event.
  */
 
 function onListening() {
   var addr = server.address();
   var bind = typeof addr === 'string'
     ? 'pipe ' + addr
     : 'port ' + addr.port;
   debug('Listening on ' + bind);
 }
 

 /* Soket IO Server */

 var cors = require('cors');
const Message = require('../models/Message');

 var io = require("socket.io")(server,{
  cors : {
    origin : "*"
  }
 });

 app.use(cors())

 var client = {};

 io.on("connection",(socket) => {
  console.log("Connected ...")
  console.log(socket.id,"has joined");
  socket.on("sining",(id) => {
    console.log(id);
    client[id] = socket;
    console.log(client);
  });
  socket.on("message",(msg) => {
    console.log(msg);
    let destination = msg.destination;
    Message.create({
      content : msg.content,
      destination : msg.destination,
      AccountId : msg.AccountId,
      state : msg.state
    }).then((value)=>{
      Message.findOne({where: {id : value.id}}).then((mess)=>{
        client[destination].emit("message",mess);
      })
    })
    // client[destination].emit("message",msg);
  });
 });

