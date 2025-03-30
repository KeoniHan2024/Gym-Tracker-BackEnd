import { NextFunction, Request, Response } from "express";
import { queryDatabase } from "../config/db"; // Assuming a query function for database queries
import {
  createExercise,
  getAllExercises,
  getUserAndDefaultExercises,
} from "../services/exerciseService";

export async function handleExerciseList(req: Request, res: Response) {
  try {
    const exerciseList = await getUserAndDefaultExercises(req.user.userid);
    return res.status(200).json(exerciseList);
  } catch (error) {
    return res.status(401).json({ message: "Internal" });
  }
}

export async function handleExerciseCreation(req: Request, res: Response) {
  try {
    const createdExercise = await createExercise(req.user.userid, req.body.exercise_name, req.body.muscleGroup);
    return res.status(201).json(createdExercise);
  } catch (error) {
    return res.status(401).json({ message: "Couldn't Add Exercise" });
  }
}
