function getNameOfRoomBySocketid(socket){
    const iterator = socket.rooms.values();
    iterator.next();
    return iterator.next().value;
}

//Use ws, a Node.js WebSocket library
const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
// const { tmpdir } = require('node:os');
const app = express();
console.log("Launched");
const codeRoom = [];
const port =  process.env.PORT || 2121;

const server = http.createServer(app);
const io = socketIO(server);
// const io = socketIO(server, {
//     cors: {
//       origins: ['http://localhost:4200/']
//     }
//   });

app.set('io', io);

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/MedferCast'));


app.get('/*', function(req,res) {
    res.sendFile(path.join(__dirname+'/dist/MedferCast/index.html'));
});


io.on('connection', (socket, test) => {

    socket.on('code', (code) => {
        socket.join(code);
    });

    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('my message', (msg) => {
        console.log('message: ' + msg);
    });

    socket.on('image', (data) => {
        console.log('image');
        // console.log(socket.rooms.get(socket.id));
        io.to(getNameOfRoomBySocketid(socket)).emit('receiveImage', data)
        // io.emit('receiveImage', `${msg}`);
    });

    socket.on('change', (e) => {
        io.to(getNameOfRoomBySocketid(socket)).emit('newPos', e);
    })
});
  
server.listen(port, () => {
    console.log("Server is listening on port : " + port);
})