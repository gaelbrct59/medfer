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
const codeRoom = {};
const port =  process.env.PORT || 2121;

const server = http.createServer(app);
// const io = socketIO(server);
const io = socketIO(server, {
    cors: {
      origins: ['http://localhost:4200/']
    }
  });

app.set('io', io);

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/MedferCast'));


app.get('/*', function(req,res) {
    res.sendFile(path.join(__dirname+'/dist/MedferCast/index.html'));
});


io.on('connection', (socket) => {

    socket.on('code', (code) => {
        if(code in codeRoom){ //Room déja existante
            io.to(socket.id).emit('response', false);
        }else{ //Sinon créer room
            io.to(socket.id).emit('response', true);
            codeRoom[code] = "";
            
        }
    });

    socket.on('getpassword', (obj) => {
        codeRoom[obj.code] = obj.pass;
        socket.join(obj.code);
    })
    
    socket.on('verifypassword', (obj) => {
        if(codeRoom[obj.code] == obj.pass){
            socket.join(obj.code);
        }
        io.to(socket.id).emit('responsepass', codeRoom[obj.code] == obj.pass);
    });

    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('leave', (code) => {
        const sids = io.of("").adapter.rooms;
        if(sids.get(code).size==1) delete codeRoom[code];
    });

    socket.on('image slice', (data) => {
        io.to(getNameOfRoomBySocketid(socket)).emit('receiveImageSlice', data);
    });

    socket.on('change', (e) => {
        io.to(getNameOfRoomBySocketid(socket)).emit('newPos', e);
    })
});
  
server.listen(port, () => {
    console.log("Server is listening on port : " + port);
})