import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config({quiet:true})

const jwt_secret=process.env.JWT_KEY as string

export const generateToken=(user:any)=>{
    return jwt.sign({user},jwt_secret,{expiresIn:"15d"})

}