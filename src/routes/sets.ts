import { handleGetSet, handleSetCreation } from "../controllers/setsController";
import authenticateToken from "../helpers/auth";



const express = require('express');
const router = express.Router();

// router.get("/", authenticateToken, (handleExerciseList));
router.post("/createSet", authenticateToken, (handleSetCreation));
router.get("/allSets", authenticateToken, (handleGetSet))



module.exports = router;