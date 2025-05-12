import { NextFunction, Request, Response } from "express";
import { createUser, verifyLogin } from "../services/userService";
import { User } from "../models/User";
import jwt from 'jsonwebtoken';


export async function handleCreateUser(req: Request, res: Response) {
  try {
    const { first_name, email, password } = req.body;

    // If fields are missing return 404 status
    if (!first_name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Otherwise call sql query to insert new user
    const newUser: User = {
      first_name: first_name,
      password: password,
      email: email,
    };

    try {
        const user = await createUser(newUser);
        return res.status(201).json({ message: "User created successfully", user: user });
    } catch (error) {
        return res.status(409).json({ message: "Username Taken" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function handleLoginUser(req: Request, res: Response) {
  try {
    const {email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // find users hash password then use checking function to see if it's right. if it is then it's success
    const userDetails = await verifyLogin(email, password);
    return res.status(200).json(userDetails);
  }
  catch(error) {
    return res.status(401).json({ message: "Internal" });
  }
}

