import type { NextFunction, Request, Response } from "express";
import { User, type IUser } from "../model/user.js";
import jwt, { type JwtPayload } from "jsonwebtoken"

export interface AuthenticatedRequest extends Request {
  user?: IUser | null;
}

export const isAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(400).json({
        message: "Please Login no header",
      });
      return;
    }

   const token=authHeader.split(" ")[1] as string

    const decode=jwt.verify(token,process.env.JWT_KEY as string) as JwtPayload

    if(!decode||!decode.user){
 res.status(400).json({
        message: "Please Login no header",
      });
      return;
    }

req.user=decode.user

next()

  } catch (error:any) {
    console.log(error);
    
     res.status(500).json({
        message:"pleaase login -jwt error"
    })
  }
};
