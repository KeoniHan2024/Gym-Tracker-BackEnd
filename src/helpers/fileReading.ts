import { readFileSync } from "fs";
import { formatDate } from "./dates";
const Fs = require("fs");
const CsvReadableStream = require("csv-reader");



export async function readFile(fileName: string): Promise<[string, number][]> {
  return new Promise((resolve, reject) => { // Wrap in a Promise
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
