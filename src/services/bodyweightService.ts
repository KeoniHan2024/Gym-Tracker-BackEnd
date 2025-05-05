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
    const result = await queryDatabase("SELECT * FROM bodyweights WHERE user_id = ?", [userid])
    return result
  }
  catch (error) {

  }

}