import { queryDatabase } from "../config/db";

export async function createSet(date_worked:string, weight:string, units:string, reps:string, user_id:string, exercise_id: string) {
  const result = await queryDatabase("INSERT INTO sets (date_worked, weight, units, reps, user_id, exercise_id) VALUES (?, ?, ?, ?, ?, ?);", [date_worked, weight, units, reps, user_id, exercise_id]);

  // Get the ID of the newly created row
  const insertedId = result.insertId;
  
  // Retrieve the full exercise row using the ID
  const createdSet = await queryDatabase(
    "SELECT * FROM exercises WHERE id = ? LIMIT 1;",
    [insertedId]
  );

}