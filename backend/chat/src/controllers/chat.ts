import axios from "axios";
import { TryCatch } from "../config/TryCatch.js";
import type { AuthenticatedRequest } from "../middleware/isAuth.js";
import { Chat } from "../models/chat.js";
import { Message } from "../models/Messages.js";

export const createNewChat = TryCatch(
  async (req: AuthenticatedRequest, res) => {
    const userId = req.user?._id;

    const { otherUserId } = req.body;

    if (!otherUserId) {
      res.status(400).json({
        message: "other userid is required",
      });
    }

    const existingChat = await Chat.findOne({
      users: { $all: [userId, otherUserId], $size: 2 },
    });

    if (existingChat) {
      res.json({
        message: "chat alreay exited",
        childId: existingChat._id,
      });
      return;
    }

    const newChat = await Chat.create({
      users: [userId, otherUserId],
    });

    res.status(200).json({
      message: "new chat created",
      chat: newChat._id,
    });
  },
);

export const getAllChat = TryCatch(async (req: AuthenticatedRequest, res) => {
  const userId = req.user?._id;
  console.log("user", userId);

  if (!userId) {
    return res.status(400).json({
      message: "user id not present",
    });
  }
  const chats = await Chat.find({ users: userId }).sort({ updatedAt: -1 });
  console.log("ch", chats);

  const chatWithUserData = await Promise.all(
    chats.map(async (chat) => {
      console.log("chahhat", chat);

      const otherUserId = chat.users.find(
        (id) => id.toString() !== userId.toString(),
      );

      const unseenCount = await Message.countDocuments({
        chatId: chat._id,
        sender: { $ne: userId },
        seen: false,
      });

      try {
        const { data } = await axios.get(
          `${process.env.USER_SERVICE}/api/v1/user/${otherUserId}`,
        );
        return {
          user: data,
          chat: {
            ...chat.toObject(),
            latestMessage: chat.latestMessage || null,
            unseenCount,
          },
        };
      } catch (error) {
        console.log(error);
        return {
          user: { _id: otherUserId, name: "unkonow user" },
          chat: {
            ...chat.toObject(),
            latestMessage: chat.latestMessage || null,
            unseenCount,
          },
        };
      }
    }),
  );

  res.json({
    chats: chatWithUserData,
  });
});


export const sendMessage=TryCatch(async(req:AuthenticatedRequest,res)=>{

const senderId=req.user?._id

const{chatId,text}=req.body
const imageFile=req.file

if(!senderId){
    return res.status(401).json({
        message:"unauthorized"
    })
}

if(!chatId){
    return res.status(401).json({
        message:"ChatId Required"
    })
}

if(!text && !imageFile){
      return res.status(401).json({
        message:"either text and image Required"
    })
}

const chat=await Chat.findById(chatId)

if(!chat){
     return res.status(401).json({
        message:"chat not found"
    })
}

const isUserInChat=chat.users.some(
    (userId)=>userId.toString()===senderId.toString()
)

if(!isUserInChat){
   return res.status(403).json({
        message:"You are not a participant of this chat"
    })
}

const otherUserId=chat.users.find((userId)=>userId.toString()!==senderId.toString())

if(!otherUserId){
    return res.status(401).json({
        message:"no otherUserId"
    })
}

//message setup

let messageData:any={
    chatId:chatId,
    sender:senderId,
    seen:false,
    seenAt:undefined
}

if(imageFile){
    messageData.image={
        url:imageFile.path,
        publicId:imageFile.filename
    }
    messageData.messageType="image"
      messageData.text=text || ""
}
else{
    messageData.text=text
    messageData.messageType="text"
}

const message=new Message(messageData)

const savedMessage=await message.save()

const latestMessageText=imageFile?"📷image":text
await Chat.findByIdAndUpdate(chatId,{
    latestMessage:{
        text:latestMessageText,
        sender:senderId
    },
    updatedAt:new Date()
},{
    new:true
})



  res.status(200).json({
    message:savedMessage,
    sender:senderId
  })

})

export const getMessagesByChat=TryCatch(async(req:AuthenticatedRequest,res)=>{

 const userId=req.user?._id
 const{chatId}=req.params

 if(!chatId){
    return res.status(401).json({
        message:"ChatId Required"
    })
}

 if(!userId){
    return res.status(401).json({
        message:"Unauthorized"
    })
}

const chat=await Chat.findById(chatId)

 if(!chat){
    return res.status(401).json({
        message:"Chat NOT FOUND"
    })
}

const isUserInChat=chat.users.some(
    (userId)=>userId.toString()===userId.toString()
)

if(!isUserInChat){
   return res.status(403).json({
        message:"You are not a participant of this chat"
    })
}

const messagesToMarkedSeen=await Message.find({
    chatId:chatId,
    sender:{$ne:userId},
    seen:false
})

await Message.updateMany({
 chatId:chatId,
    sender:{$ne:userId},
    seen:false
},{
  seen:true,
  seentAt:new Date()
})

const messages=await Message.find({
  chatId
}).sort({createdAt:-1})

const otherUserId=chat.users.find((id)=>id.toString()!==userId.toString())
 
try {

   const { data } = await axios.get(
          `${process.env.USER_SERVICE}/api/v1/user/${otherUserId}`,
        );

        if(!otherUserId){
             return res.status(400).json({
        message:"You are not a participant of this chat"
    })
        }

//socket work


res.json({
  user:data,
  messages,
})
  
} catch (error) {
  console.log(error);
  res.json({
    messages,
    user:{_id:otherUserId,name:"unknow user"}
  })
  
}

})
