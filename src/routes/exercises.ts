import { handleDeleteExercise, handleEditExercise, handleExerciseCreation, handleExerciseList, handleNonEmptyExerciseList } from "../controllers/exerciseController";
import authenticateToken from "../helpers/auth";



const express = require('express');
const router = express.Router();


// get routes
router.get("/", authenticateToken, (handleExerciseList));
router.get("/notnull", authenticateToken, (handleNonEmptyExerciseList));

// post routes
router.post("/createExercise", authenticateToken, (handleExerciseCreation));


//patch routes
router.patch("/edit/:exercise_id", authenticateToken, (handleEditExercise));

//delete routes
router.delete("/delete/:exercise_id", authenticateToken, (handleDeleteExercise));


module.exports = router;