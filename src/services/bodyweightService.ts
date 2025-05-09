import { queryDatabase } from "../config/db";

export async function createBodyWeight(userid:string, bodyweight:string, units: string, date: string) {
  try {

      await queryDatabase(
      "INSERT INTO bodyweights (user_id, weight, units, log_date) VALUES (?, ?, ?, ?);", [userid, bodyweight, units, date]
    );
  }
  catch (error) {
    
  }
}


export async function getUserBodyweightHistory(userid:string) {
  try {
    const result = await queryDatabase("SELECT * FROM bodyweights WHERE user_id = ? ORDER BY log_date", [userid])
    return result
  }
  catch (error) {
  }
}


export async function importBodyweightFile(user_id: string, weight: string, date:string) {
  try {
    await queryDatabase("INSERT INTO bodyweights (user_id, weight, log_date, units) VALUES (?, ?, ?, ?)", [user_id, weight, date, "lbs"])
  }
  catch (error) {
    throw error
  }
}

export async function deleteAllBodyweights(user_id: string) {
  try {
    await queryDatabase("DELETE FROM bodyweights WHERE user_id = ?;",[user_id])
  }
  catch (err) {
    throw err
  }
}