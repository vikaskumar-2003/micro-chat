"use client";

import ChatSidebar from "@/components/ChatSidebar";
import Loading from "@/components/Loading";
import { chat_service, useAppData, User } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import axios from "axios";
import ChatHeader from "@/components/ChatHeader";
import ChatMessages from "@/components/ChatMessages";

export interface Message {
  _id: string;
  chatId: string;
  sender: string;
  text?: string;
  image?: {
    url: string;
    publicId: string;
  };
  messageType: "text" | "image";
  seen: boolean;
  seenAt?: string;
  createdAt: string;
}

const Chat = () => {
  const {
    loading,
    isAuth,
    logoutUser,
    chats,
    user: loggedInUser,
    users,
    fetchChats,
    setChats,
  } = useAppData();

  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const [message, setMessage] = useState("");

  const [sideBarOpen, setSideBarOpen] = useState(false);

  const [messages, setMessages] = useState<Message[] | null>(null);

  const [showAllUsers, setShowAllUsers] = useState(false);
  const [user, setUser] = useState<User | null>(null);
 const[isTyping,setIsTyping]=useState(false)
 const[typingTimeOut,setTypingTimeOut]=useState<NodeJS.Timeout|null>(null)

  const router = useRouter();

  useEffect(() => {
    if (!isAuth && !loading) {
      router.push("/login");
    }
  }, [isAuth, router, loading]);

   
  const handleLogout=()=>logoutUser()

  async function fetchChat(){
    const token=Cookies.get("token")
    if (!token) {
      return
    }
    console.log("set set",selectedUser);
    

    try {
      const {data}=await axios.get(`${chat_service}/api/v1/message/${selectedUser}`,{
            headers:{
              Authorization:`Bearer ${token}`
            }
      })

     setMessages(data.messages)
     setUser(data.user)

     await fetchChats()
      
    } catch (error) {
      toast.error("failded to load themessage")
    }
  }

  async function createChat(u:User){
    try {
      const token=Cookies.get("token")
      const{data}=await axios.post(`${chat_service}/api/v1/chat/new`,{userId:loggedInUser?._id,
        otherUserId:u._id
      },{
        headers:{
          Authorization:`Bearer ${token}`
        }
      })

      setSelectedUser(data.chatId)
      setShowAllUsers(false)
      await fetchChats()

    } catch (error) {
      toast.error("failed to start chat")
    }
  }

  useEffect(()=>{

    if (selectedUser) {
        fetchChat()
    }

  },[selectedUser])

  if (loading) {
    return <Loading />;
  }

  return <div className="min-h-screen flex bg-gray-900 text-white relative overflow-hidden ">
    
    <ChatSidebar sideBarOpen={sideBarOpen} setSideBarOpen={setSideBarOpen} showAllUsers={showAllUsers} setShowAllUsers={setShowAllUsers} loggedInUser={loggedInUser} chats={chats} setSelectedUser={setSelectedUser} users={users} selectedUser={selectedUser} handleLogout={handleLogout} createChat={createChat} />

    <div className="flex-1 flex flex-col justify-between p-4 backdrop-blur-xl bg-white/5 border-1 border-white/10 ">
  
     
      <ChatHeader user={user} setSideBarOpen={setSideBarOpen} isTyping={isTyping}/>


           <ChatMessages selectedUser={selectedUser} messages={messages} loggedInUser={loggedInUser}/>
 

    </div>
    
    </div>;
};

export default Chat;
