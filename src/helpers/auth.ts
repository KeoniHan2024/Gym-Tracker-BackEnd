import { NextFunction, Request, Response } from "express";
import { createUser, verifyLogin } from "../services/userService";
import jwt from 'jsonwebtoken';

function authenticateToken(req: Request, res:Response, next:NextFunction) {
    const authHeader = req.headers['authorization']
    const token: string | undefined = authHeader && authHeader.split(' ')[1]
  
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, decoded) => {
      if (err) return res.sendStatus(403)
    //   const { userid, email } = decoded as {userid: string, email:string} 
        req.user = decoded
        next();
    })
  
  }
  
export default authenticateToken;