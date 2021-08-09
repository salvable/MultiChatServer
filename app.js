const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const port = 3002;
const app = express();
const cors = require('cors')

const server = http.createServer(app);
const io = socketIo(server,{
    cors: {
        origin: "http://localhost:3001",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    // connection 요청시 roomName과 userName을 보내줌
    socket.on("join", ({roomName: room, userName: user}) => {
        // 받아온 roomName으로 입장
        socket.join(room);
        // 해당 룸에 메세지 전송
        socket.on("onSend", (messageItem) => {
            console.log(messageItem)
            io.to(room).emit("onReceive", messageItem);
        });

        socket.on("disconnect", () => {
            socket.leave(room);
        });
    });
})

server.listen(port, () => console.log(`Listening on port ${port}`));