import { formatDate } from "./dates";
import { getExerciseID } from "../services/exerciseService";
import { queryDatabase } from "../config/db";
import { hash } from "crypto";
const Fs = require("fs");
const CsvReadableStream = require("csv-reader");
interface ExerciseData {
  exerciseName: string;
  date: string;
  weights: number[];
  reps: number[];
  exercise_id: string;
}

interface ExerciseSet {
  exerciseName: string;
  date: string;
  weight: number;
  reps: number;
  exercise_id: string;
}

export async function readBodyweightFile(
  fileName: string
): Promise<[string, number][]> {
  return new Promise((resolve, reject) => {
    // Wrap in a Promise
    let inputStream = Fs.createReadStream(fileName, "utf8");
    const res: [string, number][] = [];

    inputStream
      .pipe(
        new CsvReadableStream({
          parseNumbers: true,
          parseBooleans: true,
          trim: true,
          skipLines: 1,
        })
      )
      .on("data", function (row: any) {
        const formattedDate = formatDate(row[0]); // Format the date
        res.push([formattedDate, row[1]]);
      })
      .on("end", function () {
        Fs.unlink(fileName, (err: any) => {
          // Handle errors during unlinking
          if (err) {
            reject(err); // Reject the Promise on unlink error
            return;
          }
          resolve(res); // Resolve the Promise with the result
        });
      })
      .on("error", function (err: any) {
        // Handle errors during reading/parsing
        reject(err); // Reject the Promise on read/parse error
      });
  });
}

export const transformToIndividualSets = (
  data: ExerciseData[]
): ExerciseSet[] => {
  return data.flatMap((exercise) => {
    // Validate that weights and reps arrays have the same length
    if (exercise.weights.length !== exercise.reps.length) {
      // console.warn(`Mismatched data for ${exercise.exerciseName} on ${exercise.date}`);
      return [];
    }

    return exercise.weights.map((weight, index) => ({
      exerciseName: exercise.exerciseName,
      date: exercise.date,
      weight: weight,
      reps: exercise.reps[index],
      exercise_id: exercise.exercise_id,
    }));
  });
};

export async function createExerciseIDMap(userId: string) {
  try {
    const results = await queryDatabase(
      "SELECT * FROM exercises WHERE user_id = ? or is_default = 1",
      [userId]
    );
    let exerciseMap: Record<string, string> = {};

    for (let i = 0; i < results.length; i++) {
      const exercise_name = results[i].exercise_name;
      const exercise_id = results[i].exercise_id;
      exerciseMap[exercise_name] =  exercise_id;
    }
    return exerciseMap;
  } catch (err) {
    throw err;
  }
}

/**
 * Parses the CSV data from a file and returns a Promise that resolves with an array
 * of ExerciseData objects.
 *
 * @param fileName - The path to the CSV file.
 * @returns A Promise that resolves with an array of ExerciseData objects, or rejects
 * with an error if there is an issue reading or parsing the file.
 */
export async function readSetsFile(
  fileName: string,
  user_id: string,
  exerciseMap: Record<string, string>
): Promise<ExerciseData[]> {
  return new Promise((resolve, reject) => {
    const inputStream = Fs.createReadStream(fileName, "utf8");
    const exerciseDataArray: ExerciseData[] = [];
    try {
      inputStream
        .pipe(
          new CsvReadableStream({
            parseNumbers: true,
            parseBooleans: true,
            trim: true,
            skipLines: 1, // Skip the header row
          })
        )
        .on("data", (row: any) => {
          const exerciseName = row[0].trim();
          const exercise_id = exerciseMap[exerciseName] as string;
          

          const filteredRow = row.filter(
            (cell: any) =>
              cell !== null &&
              cell !== undefined &&
              cell.toString().trim() !== ""
          );

          for (let i = 1; i < filteredRow.length; i += 3) {
            // Extract date, weights, and reps for the current set
            const date = filteredRow[i].toString().trim();
            let weights = filteredRow[i + 1].toString().trim();
            weights = weights.split("|");
            let reps = filteredRow[i + 2].toString().trim();
            reps = reps.split("|");

            exerciseDataArray.push({
              exerciseName,
              date,
              weights,
              reps,
              exercise_id, 
            });
          }
        })
        .on("end", () => {
          Fs.unlink(fileName, (err: any) => {
            if (err) {
              reject(err);
            } else {
              resolve(exerciseDataArray);
            }
          });
        })
        .on("error", (err: any) => {
          reject(err); // Reject the Promise on error
        });
        
      return exerciseDataArray;
    } catch (err) {
      throw err;
    }
  });
}

/**
 * Processes the exercise data array and organizes it by exercise name and date.
 *
 * @param dataArray - An array of exercise data in the format you provided.
 * @param userId - The ID of the user whose data is being processed.
 * @returns An object where keys are exercise names, and values are objects
 * mapping dates to weight and rep data.
 */
export function processExerciseData(dataArray: ExerciseData[], userId: string) {
  // add it to a map so it's easier to
  let dataToInsert = [];

  // console.log(dataArray)

  // console.log(dataArray);
  // for (let i = 0; i < dataArray.length; i++) {
  //   console.log(dataArray[i]);
  // }
  // dataToInsert.push([date_worked, weight, "lbs", reps, userId, exerciseID, "weight", exerciseName]);

  // return userData;
}
