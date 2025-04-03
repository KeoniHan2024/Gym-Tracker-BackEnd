import { queryDatabase } from "../config/db";

export async function createWeightSet(date_worked:string, weight:string, units:string, reps:string, user_id:string, exercise_id: string) {
  const result = await queryDatabase("INSERT INTO sets (date_worked, weight, units, reps, user_id, exercise_id) VALUES (?, ?, ?, ?, ?, ?);", 
    [date_worked, weight, units, reps, user_id, exercise_id]);

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
  const result = await queryDatabase("INSERT INTO sets (date_worked, units, user_id, exercise_id, distance) VALUES (?, ?, ?, ?, ?);", 
    [date_worked, units, user_id, exercise_id, distance]);

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
  const result = await queryDatabase("INSERT INTO sets (date_worked, duration_seconds, user_id, exercise_id) VALUES (?, ?, ?, ?);", 
    [date_worked, duration_seconds, user_id, exercise_id, date_worked]);

  // Get the ID of the newly created row
  const insertedId = result.insertId;
  
  // Retrieve the full exercise row using the ID
  const createdSet = await queryDatabase(
    "SELECT * FROM sets WHERE id = ? LIMIT 1;",
    [insertedId]
  );
  return createdSet
}