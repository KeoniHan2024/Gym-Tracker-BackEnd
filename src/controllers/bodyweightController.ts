import { NextFunction, query, Request, Response } from "express";
import {
  createBodyWeight,
  getUserBodyweightHistory,
  importBodyweightFile,
} from "../services/bodyweightService";
import { bodyweightInfo } from "../types/express";
import { convertDate } from "../helpers/dates";
import multer from "multer";
import { readFile } from "../helpers/fileReading";
import { queryDatabase } from "../config/db";
import { calculateMovingAverage } from "../helpers/graph";
interface MulterRequest extends Request {
  file?: Express.Multer.File; // Define the 'file' property
}

export async function handleAddBodyweight(req: Request, res: Response) {
  try {
    await createBodyWeight(
      req.user.userid,
      req.body.payload.bodyWeight,
      req.body.payload.type,
      req.body.payload.date
    );
    return res.status(200).json({ message: "added bodyweight!" });
  } catch (error) {
    return res.status(401).json({ message: "couldn't add bodyweight!" });
  }
}

export async function handleGetUserBodyweightHistory(
  req: Request,
  res: Response
) {
  try {
    const bodyweightObjects: bodyweightInfo[] = await getUserBodyweightHistory(
      req.user.userid
    );
    const result = calculateMovingAverage(bodyweightObjects, 7);

    const bodyweights = result.map((object) => {
      return object.movingAverage;
    });

    const dates = result.map((object) => {
      return convertDate(object.date as string);
    });

    const combinedData = bodyweights.map((weight, index) => ({
      weight: weight,
      date: dates[index],
    }));
    // Filter out the objects where weight is null
    const filteredData = combinedData.filter((item) => item.weight !== null);

    // Separate the filtered data back into two arrays
    const filteredBodyweights = filteredData.map((item) => item.weight);
    const filteredDates = filteredData.map((item) => item.date);

    return res
      .status(200)
      .json({
        data: filteredBodyweights,
        labels: filteredDates,
        message: "successfully retrieved bodyweight for user",
      });
  } catch (error) {
    return res.status(401).json({ message: "couldn't get bodyweights" });
  }
}

export async function handleImportBodyweightFile(
  req: MulterRequest,
  res: Response
) {
  if (req.file) {
    const csvArray = await readFile(req.file.path);
    let recentWeight = 0; // keep track of latest weight

    for (let i = 0; i < csvArray.length; i++) {
      const date = csvArray[i][0];
      let weight = csvArray[i][1];

      // when the weight is a string then use the last number recorded
      if (typeof weight != "number") {
        weight = recentWeight;
      }

      importBodyweightFile(req.user.userid, weight as unknown as string, date);
      recentWeight = weight;
    }
    return res.status(200).json();
  } else {
    return;
  }
}
