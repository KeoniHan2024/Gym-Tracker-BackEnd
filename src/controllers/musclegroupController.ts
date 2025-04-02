import { getAllMuscleGroups } from "../services/musclegroupService";
import { Request, Response } from "express";

export async function handleMuscleGroupList(req: Request, res: Response) {
    try {
        const muscleGroupList = await getAllMuscleGroups();
        return res.status(200).json(muscleGroupList);
    } catch (error) {
        return res.status(401).json({ message: "Internal" });
    }
}