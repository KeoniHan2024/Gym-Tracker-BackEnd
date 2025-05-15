import { set } from "mongoose";
import { queryDatabase } from "../config/db";

type Set = {
  id: number;
  name: string;
};
export async function createWeightSet(
  date_worked: string,
  weight: string,
  units: string,
  reps: string,
  user_id: string,
  exercise_id: string,
  exercise_name: string
) {
  const result = await queryDatabase(
    "INSERT INTO sets (date_worked, weight, units, reps, user_id, exercise_id, exercise_type, exercise_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?);",
    [
      date_worked,
      weight,
      units,
      reps,
      user_id,
      exercise_id,
      "weight",
      exercise_name,
    ]
  );

  // Get the ID of the newly created row
  const insertedId = result.insertId;
  // // Retrieve the full exercise row using the ID
  // const [createdSet] = await queryDatabase(
  //   "SELECT * FROM sets WHERE id = ? LIMIT 1;",
  //   [insertedId]
  // );

  return insertedId;
}

export async function createDistanceSet(
  date_worked: string,
  units: string,
  user_id: string,
  exercise_id: string,
  distance: string,
  exercise_name: string
) {
  const result = await queryDatabase(
    "INSERT INTO sets (date_worked, units, user_id, exercise_id, distance, exercise_type, exercise_name) VALUES (?, ?, ?, ?, ?, ?, ?);",
    [
      date_worked,
      units,
      user_id,
      exercise_id,
      distance,
      "distance",
      exercise_name,
    ]
  );

  // Get the ID of the newly created row
  const insertedId = result.insertId;

  // Retrieve the full exercise row using the ID
  const createdSet = await queryDatabase(
    "SELECT * FROM sets WHERE id = ? LIMIT 1;",
    [insertedId]
  );
  return createdSet;
}

export async function createTimeSet(
  date_worked: string,
  duration_seconds: string,
  user_id: string,
  exercise_id: string,
  exercise_name: string
) {
  const result = await queryDatabase(
    "INSERT INTO sets (date_worked, duration_seconds, user_id, exercise_id, exercise_type, exercise_name) VALUES (?, ?, ?, ?, ?, ?);",
    [date_worked, duration_seconds, user_id, exercise_id, "time", exercise_name]
  );

  // Get the ID of the newly created row
  const insertedId = result.insertId;

  // Retrieve the full exercise row using the ID
  const createdSet = await queryDatabase(
    "SELECT * FROM sets WHERE id = ? LIMIT 1;",
    [insertedId]
  );
  return createdSet;
}

export async function getWeightSetsForExercise(
  exercise_id: string,
  user_id: string
) {
  const result = await queryDatabase(
    "SELECT * FROM sets WHERE (exercise_id = ? AND user_id = ? AND exercise_type = ? ) ORDER BY CAST(date_worked as DATE) ASC, date_worked ASC",
    [exercise_id, user_id, "weight"]
  );
  return result;
}

export async function getAllSetsForUser(user_id: string) {
  const result = await queryDatabase(
    "SELECT * FROM sets WHERE user_id = ? ORDER BY date_worked DESC",
    [user_id]
  );
  const resultMap: { [date: string]: { [exercise_name: number]: any[] } } = {};

  for (const set of result) {
    const dateWorked = set.date_worked;
    const exerciseName = set.exercise_name;
    const formattedDate = new Date(dateWorked).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    if (!resultMap[formattedDate]) {
      resultMap[formattedDate] = {};
    }
    if (!resultMap[formattedDate][exerciseName]) {
      resultMap[formattedDate][exerciseName] = [];
    }
    resultMap[formattedDate][exerciseName].push(set);
  } // remove the return from inside the loop

  return resultMap;
}

export async function deleteSet(user_id: string, set_id: string) {
  try {
    await queryDatabase("DELETE FROM sets WHERE user_id = ? and set_id = ?", [
      user_id,
      set_id,
    ]);
  } catch (err) {}
}

export async function editSet(
  date: string,
  weight: string,
  reps: string,
  set_id: string,
  userID: string
) {
  try {
    await queryDatabase(
      "UPDATE sets SET date_worked = ?, weight = ?, reps = ? WHERE (set_id = ? AND user_id = ?)",
    [date, weight, reps, set_id, userID]);
  } catch (err) {
    throw err;
  }
}

export async function deleteAllSets(user_id: string) {
try {
    await queryDatabase("DELETE FROM sets WHERE user_id = ?;",[user_id])
  }
  catch (err) {
    throw err
  }
}
