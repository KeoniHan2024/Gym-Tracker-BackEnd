import { NextFunction, query, Request, Response } from "express";
import { createWeightSet, createDistanceSet, createTimeSet, getWeightSetsForExercise } from "../services/setsService";
import { getExerciseID } from "../services/exerciseService";
import { queryDatabase } from '../config/db';
import { weightSet } from "../types/express";
import { averageWeightPerRep } from "../helpers/setTransformation";

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

// gets average weight per rep
function averageOfList(list: {weight: number, reps: number}[]): number {
    if (list.length === 0) {
      return 0;
    }
    const weightSum = list.reduce((accumulator, currentValue) => accumulator + currentValue.weight, 0);
    const repsSum = list.reduce((accumulator, currentValue) => accumulator + currentValue.reps, 0);

    return weightSum / repsSum;
}
  

export async function handleGetSet(req: Request, res: Response ) {
    // get all weight sets that are for this exercise id 
    const query = req.query
    const result: weightSet[] = await getWeightSetsForExercise(query.exercise_id as string, req.user.userid)
    var setsPerDay: {[date: string] : number[] } = {};

    const groupedSets = averageWeightPerRep(result)

    // sort the dates in order
    const dates = Object.keys(groupedSets)
    dates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    // make an array where each date (key)   is linked to an element which will be a datapoint for the graph
    const averages = dates.map((date) => {
      const setsForDate = groupedSets[date];
        const weightList = setsForDate.map((set)=> {return {weight: set.weight, reps: set.reps}});
        if (!setsPerDay[date]) {
          setsPerDay[date] = [];
        }
        for (let i=0; i< setsForDate.length; i++) {
          const weightArray = setsForDate.map((set)=> {return parseFloat(set.weight.toFixed(2));}) 
          setsPerDay[date].push(...weightArray);
        }
        return averageOfList(weightList)
    })

    // return a list of the dates and a list of the average weight
    return res.status(201).json({ labels: dates, averages: averages, groupedSets: groupedSets, setsPerDay: setsPerDay});
}
