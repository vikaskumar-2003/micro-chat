
import { Server, Socket } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const userSocketMap: Record<string, string> = {};

export const getRecieverSocketId=(reciverId:string):string  | undefined=>{

  return userSocketMap[reciverId]

}

io.on("connection", (socket: Socket) => {
  console.log("User connected:", socket.id);

  const userId = socket.handshake.query.userId as string | undefined;

  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;

    console.log(`User ${userId} mapped to socket ${socket.id}`);
  }

  io.emit("getOnlineUser", Object.keys(userSocketMap));

  if(userId){
    socket.join(userId)
  }

  socket.on("typing",(data)=>{
    console.log(`user ${data.userId} is typing in chat ${data.chatId}`);


   console.log("TYPING RECEIVED:", data);

  console.log(
    "CHAT ROOM MEMBERS:",
    io.sockets.adapter.rooms.get(data.chatId)
  );


    socket.to(data.chatId).emit("userTyping",{
      chatId:data.chatId,
      userId:data.userId
    })
    
  })

  socket.on("stopTyping",(data)=>{
    console.log(`user ${data.userId} is stop in chat ${data.chatId}`);
    socket.to(data.chatId).emit("userStoppedTyping",{
      chatId:data.chatId,
      userId:data.userId
    })
    
  })

  socket.on("joinChat",(chatId)=>{
    socket.join(chatId)
    console.log(`user ${userId} joined chat romm ${chatId}`);
    socket.join(chatId);

  console.log("JOINED CHAT:", chatId);

  console.log(
    "ROOM MEMBERS:",
    io.sockets.adapter.rooms.get(chatId)
  );
    
  })

//   socket.on("joinChat", (chatId: string) => {
//   socket.join(chatId);

//   console.log("JOINED CHAT:", chatId);

//   console.log(
//     "ROOM MEMBERS:",
//     io.sockets.adapter.rooms.get(chatId)
//   );
// });

  socket.on("leaveChat",(chatId)=>{
              socket.leave(chatId)
                console.log(`user ${userId} left chat romm ${chatId}`);
  })

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    if (userId && userSocketMap[userId] === socket.id) {
      delete userSocketMap[userId];
    }

    io.emit("getOnlineUser", Object.keys(userSocketMap));
  });
});

export { app, server, io };
