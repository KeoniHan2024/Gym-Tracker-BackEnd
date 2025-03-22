import { handleExerciseCreation, handleExerciseList } from "../controllers/exerciseController";
import authenticateToken from "../helpers/auth";



const express = require('express');
const router = express.Router();

router.get("/", authenticateToken, (handleExerciseList));
router.post("/createExercise", authenticateToken, (handleExerciseCreation));


module.exports = router;