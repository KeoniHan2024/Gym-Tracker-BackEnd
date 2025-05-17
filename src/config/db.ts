const mysql = require('mysql2');

export const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
}).promise();


interface ExerciseSet {
  exerciseName: string;
  date: string;
  weight: number;
  reps: number;
  exercise_id: string;
}
    
export async function queryDatabase(sql: string, params?: any[]) {
    try {
        const result = await pool.query(sql, params);
        const rows = result[0];
        return rows;
    }
    catch (error) {
        throw error;
    }
} 

export function closePool() {
    pool.end();
}

/**
 * Imports exercise sets into the database
 * @param sets Array of exercise sets to import
 * @returns Number of sets successfully imported
 */
export async function importExerciseSetsToDatabase(sets: ExerciseSet[], user_id: string): Promise<number> {
  // Return early if no sets to import
  if (!sets.length) return 0;
  
  let successCount = 0;
  
  try {
    // Begin transaction
    await queryDatabase('START TRANSACTION');
    
    const sql = `
      INSERT INTO sets 
      (exercise_id, exercise_name, date_worked, weight, reps, exercise_type, user_id, units) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    // Prepare all sets for insertion
    const promises = sets.map(set => {
      // Format date (assuming MM/DD/YY format needs to be YYYY-MM-DD)
      const dateParts = set.date.split('/');
      let formattedDate = set.date;
      
      if (dateParts.length === 3) {
        const year = dateParts[2].length === 2 ? `20${dateParts[2]}` : dateParts[2];
        formattedDate = `${year}-${dateParts[0]}-${dateParts[1]}`;
      }
      
      return queryDatabase(sql, [
        set.exercise_id,
        set.exerciseName,
        formattedDate,
        set.weight,
        set.reps,
        "weight",
        user_id,
        "lbs"
      ]);
    });
    
    // Execute all inserts
    const results = await Promise.allSettled(promises);
    
    // Count successful inserts
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        successCount++;
      } else {
        console.error(`Error importing set ${sets[index].exerciseName} on ${sets[index].date}:`, result.reason);
      }
    });
    
    // Commit transaction if any sets were imported successfully
    if (successCount > 0) {
      await queryDatabase('COMMIT');
    } else {
      // Rollback if all inserts failed
      await queryDatabase('ROLLBACK');
    }
  } catch (error) {
    // Rollback transaction on any error
    await queryDatabase('ROLLBACK');
    console.error('Transaction failed during exercise set import:', error);
  }
  
  return successCount;
}

