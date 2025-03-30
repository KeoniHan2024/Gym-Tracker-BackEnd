import { queryDatabase } from "../config/db";

export async function getAllMuscleGroups() {
    const musclegroups = await queryDatabase("SELECT * FROM musclegroups");
    return musclegroups;
}