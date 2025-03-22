import { queryDatabase } from "../config/db";

export async function getAllExercises() {
  const exerciseList = await queryDatabase("SELECT * FROM exercises WHERE user_id IS NULL;");
  return exerciseList
}

export async function getUserAndDefaultExercises(userid:string) {
  const exerciseList = await queryDatabase("SELECT * FROM exercises WHERE user_id = ? OR is_default = 1;", [userid]);
  return exerciseList
}

export async function createExercise(userid:string, exercise_name:string) {
  const result = await queryDatabase("INSERT INTO exercises (user_id, exercise_name, is_default) VALUES (?, ?, ?);", [userid, exercise_name, 0]);

  // Step 2: Get the ID of the newly created row
  const insertedId = result.insertId;
  // Step 3: Retrieve the full exercise row using the ID
  const createdExercise = await queryDatabase(
    "SELECT * FROM exercises WHERE id = ? LIMIT 1;",
    [insertedId]
  );
  
  return createdExercise[0];
}
