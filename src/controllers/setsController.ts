import { NextFunction, Request, Response } from "express";
import { createWeightSet, createDistanceSet, createTimeSet } from "../services/setsService";
import { getExerciseID } from "../services/exerciseService";
import { queryDatabase } from '../config/db';


export async function handleSetCreation(req: Request, res: Response) {
  var createdSet;
  const payload = req.body.payload
    try {
      const exercise_id = await getExerciseID(req.user.userid, payload.exercise_name)

      switch (payload.exercise_type) {
        case "weight":
          if (payload.exercise_name != null && payload.weight != null && payload.units  != null && payload.reps != null && payload.date_worked != null) {
            createdSet = await createWeightSet(payload.date_worked, payload.weight, payload.units, payload.reps, req.user.userid, exercise_id);

            // add notes to it if there were notes
            if (payload.notes != '') {
              const newId:string = createdSet[0].id
              await queryDatabase('UPDATE sets SET notes=? WHERE id = ?', [String(payload.notes), newId])
            }
          }
          else {
            return res.status(400).json({ message: "One or more fields are invalid or empty" });
          }
          break
        case "distance":
          if (payload.exercise_name != null && payload.distance != null && payload.units != null && payload.date_worked != null) {
            createdSet = await createDistanceSet(payload.date_worked, payload.units, req.user.userid, exercise_id, payload.distance);
          }
          else {
            return res.status(400).json({ message: "One or more fields are invalid or empty" });
          }

          // add notes to it if there were notes
          if (payload.notes != '') {
            const newId:string = createdSet[0].id
            await queryDatabase('UPDATE sets SET notes=? WHERE id = ?', [String(payload.notes), newId])
          }
          break
        case "time":
          if (payload.duration_seconds == 0) {
            return res.status(400).json({ message: "Duration should be longer than 0 seconds" });
          }
          if (payload.exercise_name != null && payload.duration_seconds != null && payload.date_worked != null && payload.duration_seconds > 0) {
            createdSet = await createTimeSet(payload.date_worked, payload.duration_seconds, req.user.userid, exercise_id);
          }
          else {
            return res.status(400).json({ message: "One or more fields are invalid or empty" });
          }

          // add notes to it if there were notes
          if (payload.notes != '') {
            const newId:string = createdSet[0].id
            await queryDatabase('UPDATE sets SET notes=? WHERE id = ?', [String(payload.notes), newId])
          }
          break
      }
      return res.status(201).json({ message: "Set was added" });
    } catch (error) {
      return res.status(401).json({ message: "Couldn't Add Set" });
    }
  }