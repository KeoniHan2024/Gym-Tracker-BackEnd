import { User } from './../models/User';
import { NextFunction, Request, Response } from "express";
import { createWeightSet } from "../services/setsService";
import { getExerciseID } from "../services/exerciseService";


export async function handleSetCreation(req: Request, res: Response) {
  var createdSet;
    try {
      const exercise_id = await getExerciseID(req.user.userid, req.body.exercise_name)
      console.log(req.body)
      console.log(exercise_id)
      switch (req.body.exercise_type) {
        case "weight":
          if (!req.body.exercise_name || !req.body.weight || !req.body.units || !req.body.reps || !!req.body.date_worked) {
            createdSet = await createWeightSet(req.body.date_worked, req.body.weight, req.body.units, req.user.userid, req.body.reps, exercise_id);
          }
          else {
            return res.status(400).json({ message: "One or more fields are invalid or empty" });
          }
          break
        case "distance":
          if (!req.body.exercise_name || !req.body.distance ||!req.body.date_worked) {
            // createdSet = await createDistanceSet(req.body.date_worked, req.body.distance, req.user.userid, req.body.date_worked, exercise_id);
          }
          else {
            return res.status(400).json({ message: "One or more fields are invalid or empty" });
          }
          break
        case "time":
          if (!req.body.exercise_name || !req.body.duration_seconds || !!req.body.date_worked) {
            // createdSet = await createTimeSet(req.body.date_worked, req.body.weight, req.body.units, req.user.userid, req.body.reps, exercise_id);
          }
          else {
            return res.status(400).json({ message: "One or more fields are invalid or empty" });
          }
          break
      }
      return res.status(201);
    } catch (error) {
      return res.status(401).json({ message: "Couldn't Add Set" });
    }
  }