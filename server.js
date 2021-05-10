//Use ws, a Node.js WebSocket library
const path = require('path');
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const app = express();
console.log("Launched");
// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/MedferCast'));

app.get('/*', function(req,res) {
    res.sendFile(path.join(__dirname+'/dist/MedferCast/index.html'));
});

// Start the app by listening on the default Heroku port
const port = 2121;
app.listen(process.env.PORT || 8080);
const server = http.createServer(express);
const webSocketServer = new WebSocket.Server( {server} )

webSocketServer.on('connection', function connection(webSocket) {
    webSocket.on('message', function messageIncoming(data){
        webSocketServer.clients.forEach((client) => {
            if(client !== webSocket && client.readyState === WebSocket.OPEN){
                client.send(data);
            }
        })
    })
})

server.listen(port, () => {
    console.log("Server is listening on port : " + port);
})