import { Message } from '@/app/chat/page';
import { User } from '@/context/AppContext';
import React, { useEffect, useMemo, useRef } from 'react'

interface ChatMessagesProps{

  selectedUser:string |null;
  messages:Message[] | null
  loggedInUser:User|null


}


const ChatMessages = ({selctedUser,messages,loggedInUser}):ChatMessagesProps => {
 
    const bottomRef=useRef<HTMLDivElement>(null)

    //seen featurs

    const uniqueMessages=useMemo(()=>{

     if(!messages) return []

     const seen=new Set()
     return messages.filter((message)=>{
        if (seen.has(message._id)) {
            return false
        }
        seen.add(message._id)
     })

    },[messages])


    useEffect(()=>{
        bottomRef.current?.scrollIntoView({behavior:"smooth"})
    },[selctedUser,uniqueMessages])

  return (
    <div>ChatMessages</div>
  )
}

export default ChatMessages