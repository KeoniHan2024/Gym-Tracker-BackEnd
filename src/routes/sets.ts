import { get } from "http";
import { handleGetAllSetsForExercise, handleGetAllSetsForUser, handleSetCreation } from "../controllers/setsController";
import authenticateToken from "../helpers/auth";
import { getgid } from "process";



const express = require('express');
const router = express.Router();

// router.get("/", authenticateToken, (handleExerciseList));


/* GET REQUESTS */


/*Get all sets from a user in descending order*/
router.get("/", authenticateToken, (handleGetAllSetsForUser))
/*Get all weight type sets for a specific exercise_id
 Params passed: exercise_id */
router.get("/:exercise_id", authenticateToken, (handleGetAllSetsForExercise))





//post requests
router.post("/createSet", authenticateToken, (handleSetCreation));



module.exports = router;