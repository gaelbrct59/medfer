//Use ws, a Node.js WebSocket library
const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const app = express();
console.log("Launched");




const port =  process.env.PORT || 2121;

const server = http.createServer(app);
const io = socketIO(server);

app.set('io', io);

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/MedferCast'));


app.get('/*', function(req,res) {
    res.sendFile(path.join(__dirname+'/dist/MedferCast/index.html'));
});


io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('my message', (msg) => {
        console.log('message: ' + msg);
    });

    socket.on('image', (msg) => {
        console.log('image');
        io.emit('receiveImage', `${msg}`);
    });
});
  

server.listen(port, () => {
    console.log("Server is listening on port : " + port);
})