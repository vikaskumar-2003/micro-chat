import express from "express"
import mongoose, { Document, Schema } from "mongoose"

export interface IChat extends Document{

 users:string[]
 latestMessage:{
    text:string;
    sender:string;
 }

 createdAt:Date;
 updatedAt:Date

}

export interface IUser extends Document{
    name:string;
    email:string;
}


const schema:Schema<IChat>= new mongoose.Schema({

   users:[{type:String,required:true}],
   latestMessage:{
    text:String,
    sender:String
   }

},{
    timestamps:true
})

export const Chat=mongoose.model<IChat>("Chat",schema)