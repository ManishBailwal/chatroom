const express = require('express');
const path = require('path');
const app = express();

const port = process.env.PORT || 4000


app.use(express.static(path.join(__dirname, 'public')));


const server = app.listen(port, ()=>{
    console.log(`server is running on port ${port}`);
})


let socketsConnected = new Set();


//setting up websockets
const io = require('socket.io')(server);

io.on('connection', onConnected);

function onConnected(socket){
    console.log(socket.id);
    socketsConnected.add(socket.id);

    io.emit('clients-total', socketsConnected.size);

    socket.on('disconnect', ()=>{
        console.log("socket disconnected", socket.id);
        socketsConnected.delete(socket.id);
        io.emit('clients-total', socketsConnected.size);
    })

    socket.on('message', (data)=>{
        console.log(data);
        socket.broadcast.emit('chat-message',data);
    })

    socket.on('feedback',(data)=>{
        socket.broadcast.emit('feedback',data);
    })
}