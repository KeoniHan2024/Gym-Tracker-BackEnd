import { handleExerciseCreation, handleExerciseList, handleNonEmptyExerciseList } from "../controllers/exerciseController";
import authenticateToken from "../helpers/auth";



const express = require('express');
const router = express.Router();

router.get("/", authenticateToken, (handleExerciseList));
router.get("/notnull", authenticateToken, (handleNonEmptyExerciseList));
router.post("/createExercise", authenticateToken, (handleExerciseCreation));


module.exports = router;