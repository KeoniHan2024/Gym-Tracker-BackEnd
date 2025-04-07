import { NextFunction, Request, Response } from "express";
import {
  createExercise,
  getAllExercises,
  getUserAndDefaultExercises,
  getNonEmptyUserExercises
} from "../services/exerciseService";
import { isBlank } from "../helpers/text";

export async function handleExerciseList(req: Request, res: Response) {
  try {
    const exerciseList = await getUserAndDefaultExercises(req.user.userid);
    return res.status(200).json(exerciseList);
  } catch (error) {
    return res.status(401).json({ message: "Internal" });
  }
}

export async function handleNonEmptyExerciseList(req: Request, res: Response) {
  try {
    // console.log(req)
    const exerciseList = await getNonEmptyUserExercises(req.user.userid);
    return res.status(200).json(exerciseList);
  } catch (error) {
    return res.status(401).json({ message: "Internal" });
  }
}

export async function handleExerciseCreation(req: Request, res: Response) {
  try {
    if (isBlank(req.body.exercise_name)) {
      return res.status(401).json({ message: "Exercise name is blank" });  
    }
    const createdExercise = await createExercise(req.user.userid, req.body.exercise_name.trim(), req.body.muscleGroup);
    return res.status(201).json({createdExercise, message: "Exercise has been added"});
  } catch (error) {
    return res.status(401).json({ message: "Couldn't Add Exercise" });
  }
}
