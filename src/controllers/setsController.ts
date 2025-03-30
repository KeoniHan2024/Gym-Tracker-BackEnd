import { NextFunction, Request, Response } from "express";
import { createSet } from "../services/setsService";



export async function handleSetCreation(req: Request, res: Response) {
    try {
      const createdSet = await createSet(req.body.date_worked, req.body.weight, req.body.units, req.user.userid, req.body.reps, req.body.exercise_id);
      return res.status(201).json(createdSet);
    } catch (error) {
      return res.status(401).json({ message: "Couldn't Add Set" });
    }
  }