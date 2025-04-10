import { queryDatabase } from "../config/db";

export async function createWeightSet(date_worked:string, weight:string, units:string, reps:string, user_id:string, exercise_id: string) {
  const result = await queryDatabase("INSERT INTO sets (date_worked, weight, units, reps, user_id, exercise_id, exercise_type) VALUES (?, ?, ?, ?, ?, ?, ?);", 
    [date_worked, weight, units, reps, user_id, exercise_id, "weight"]);

  // Get the ID of the newly created row
  const insertedId = result.insertId;
  
  // Retrieve the full exercise row using the ID
  const createdSet = await queryDatabase(
    "SELECT * FROM sets WHERE id = ? LIMIT 1;",
    [insertedId]
  );

  return createdSet
}

export async function createDistanceSet(date_worked:string, units:string, user_id:string, exercise_id: string, distance:string) {
  const result = await queryDatabase("INSERT INTO sets (date_worked, units, user_id, exercise_id, distance, exercise_type) VALUES (?, ?, ?, ?, ?, ?);", 
    [date_worked, units, user_id, exercise_id, distance, "distance"]);

  // Get the ID of the newly created row
  const insertedId = result.insertId;
  
  // Retrieve the full exercise row using the ID
  const createdSet = await queryDatabase(
    "SELECT * FROM sets WHERE id = ? LIMIT 1;",
    [insertedId]
  );
  return createdSet
}

export async function createTimeSet(date_worked:string, duration_seconds:string, user_id:string, exercise_id: string) {
  const result = await queryDatabase("INSERT INTO sets (date_worked, duration_seconds, user_id, exercise_id, exercise_type) VALUES (?, ?, ?, ?, ?);", 
    [date_worked, duration_seconds, user_id, exercise_id, date_worked, "time"]);

  // Get the ID of the newly created row
  const insertedId = result.insertId;
  
  // Retrieve the full exercise row using the ID
  const createdSet = await queryDatabase(
    "SELECT * FROM sets WHERE id = ? LIMIT 1;",
    [insertedId]
  );
  return createdSet
}

export async function getWeightSetsForExercise(exercise_id: string, user_id:string) {
  const result = await queryDatabase("SELECT * FROM sets WHERE (exercise_id = ? AND user_id = ? AND exercise_type = ? ) ORDER BY CAST(date_worked as DATE) ASC, date_worked ASC", [exercise_id, user_id, "weight"])
  return result
}