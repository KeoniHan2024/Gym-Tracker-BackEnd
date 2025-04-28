import { NextFunction, Request, Response } from "express";
import { createBodyWeight } from "../services/bodyweightService";

export async function handleAddBodyweight(req: Request, res: Response) {
  try {
    console.log(req.body)
    createBodyWeight(
      req.user.userid,
      req.body.payload.bodyWeight,
      req.body.payload.type,
      req.body.payload.date
    );
    return res.status(200).json({ message: "added bodyweight!" });
  } catch (error) {
    return res.status(401).json({ message: "couldn't add bodyweight!" });
  }
}
