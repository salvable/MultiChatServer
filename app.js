const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const port = 3002;
const app = express();
const cors = require('cors')

const server = http.createServer(app);
const io = socketIo(server);
app.use(cors());

io.on("connection", (socket) => {
    console.log(socket)
    // connection 요청시 roomName과 userName을 보내줌
    socket.on("join", ({roomName: room, userName: user}) => {
        console.log(room,user)
        // 받아온 roomName으로 입장
        socket.join(room);
        // 해당 room에 전송
        io.to(room).emit("onConnect", `${user} 님이 입장했습니다.`);
        // 해당 룸에 메세지 전송
        socket.on("onSend", (messageItem) => {
            io.to(room).emit("onReceive", messageItem);
        });

        socket.on("disconnect", () => {
            socket.leave(room);
            io.to(room).emit("onDisconnect", `${user} 님이 퇴장하셨습니다.`);
        });
    });
})

server.listen(port, () => console.log(`Listening on port ${port}`));