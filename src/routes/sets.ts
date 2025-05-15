import { get } from "http";
import { handleDeleteSet, handleEditSet, handleGetAllSetsForExercise, handleGetAllSetsForUser, handleImportSetsFile, handleSetCreation } from "../controllers/setsController";
import authenticateToken from "../helpers/auth";
import { getgid } from "process";



const express = require('express');
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // Files saved in 'uploads/'


// router.get("/", authenticateToken, (handleExerciseList));


/* GET REQUESTS */
/*Get all sets from a user in descending order*/
router.get("/", authenticateToken, (handleGetAllSetsForUser))
/*Get all weight type sets for a specific exercise_id
 Params passed: exercise_id */
router.get("/:exercise_id", authenticateToken, (handleGetAllSetsForExercise))


/* DELETE REQUESTS */
router.delete("/:set_id", authenticateToken, (handleDeleteSet))

/* POST REQUESTS */
router.post("/createSet", authenticateToken, (handleSetCreation));
router.post("/import", authenticateToken,  upload.single("file"), (handleImportSetsFile));

/* PATCH REQUESTS */
router.patch("/:set_id", authenticateToken, (handleEditSet))


module.exports = router;