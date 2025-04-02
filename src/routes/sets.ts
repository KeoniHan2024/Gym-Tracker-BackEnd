import { handleSetCreation } from "../controllers/setsController";
import authenticateToken from "../helpers/auth";



const express = require('express');
const router = express.Router();

// router.get("/", authenticateToken, (handleExerciseList));
router.post("/createSet", authenticateToken, (handleSetCreation));


module.exports = router;