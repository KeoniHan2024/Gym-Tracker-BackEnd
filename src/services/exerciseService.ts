import { queryDatabase } from "../config/db";

export async function getAllExercises() {
  const exerciseList = await queryDatabase("SELECT * FROM exercises WHERE user_id IS NULL;");
  return exerciseList
}

export async function getUserAndDefaultExercises(userid:string) {
  const exerciseList = await queryDatabase("SELECT * FROM exercises WHERE user_id = ? OR is_default = 1;", [userid]);
  return exerciseList
}

export async function getNonEmptyUserExercises(userid:string) {
  const exerciseList = await queryDatabase("SELECT DISTINCT e.* FROM sets s, exercises e WHERE e.exercise_id = s.exercise_id AND (e.user_id = ? OR e.is_default = 1)", [userid]);
  return exerciseList
}

export async function getExerciseID(user_id:string, exerciseName:string) {
  const exerciseID = await queryDatabase("SELECT * FROM exercises WHERE (user_id = ? OR is_default = 1) AND exercise_name = ?;", [user_id, exerciseName]);
  return exerciseID[0].id
}

export async function createExercise(userid:string, exercise_name:string, muscleGroupId:string) {
  const result = await queryDatabase("INSERT INTO exercises (user_id, exercise_name, is_default) VALUES (?, ?, ?);", [userid, exercise_name, 0]);

  // Get the ID of the newly created row
  const insertedId = result.insertId;
  
  // Retrieve the full exercise row using the ID
  const createdExercise = await queryDatabase(
    "SELECT * FROM exercises WHERE id = ? LIMIT 1;",
    [insertedId]
  );

  const muscleGroupInsertion = await queryDatabase(
    "INSERT INTO exercise_muscles (exercise_id, muscle_group_id) VALUES (?, ?);",
    [insertedId, muscleGroupId]
  );

  
  
  return createdExercise[0];
}
