import { NextFunction, Request, Response } from "express";
import { createBodyWeight, getUserBodyweightHistory } from "../services/bodyweightService";
import { bodyweightInfo } from "../types/express";
import {convertDate} from "../helpers/dates";

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


export async function handleGetUserBodyweightHistory(req: Request, res: Response) {
  try {
    const bodyweightObjects: bodyweightInfo[] = await getUserBodyweightHistory(req.user.userid)
    const bodyweights = bodyweightObjects.map((object) => {
      return object.weight
    })
    const dates = bodyweightObjects.map((object) => {
      return convertDate(object.log_date as string)
    })
    return res.status(200).json({data: bodyweights, labels: dates, message: "successfully retrieved bodyweight for user" });
  } catch (error) {
    return res.status(401).json({ message: "couldn't get bodyweights" });
  }
}


export async function handleImportBodyweightFile(req: Request, res:Response) {
  console.log(req)
  return
}
