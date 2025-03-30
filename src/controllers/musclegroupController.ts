import { getAllMuscleGroups } from "../services/musclegroupService";
import { Request, Response } from "express";

export async function handleMuscleGroupList(req: Request, res: Response) {
    try {
        const exerciseList = await getAllMuscleGroups();
        console.log(exerciseList)
        return res.status(200).json(exerciseList);
    } catch (error) {
        return res.status(401).json({ message: "Internal" });
    }
}