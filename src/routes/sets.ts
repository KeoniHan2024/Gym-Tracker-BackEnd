import { handleDeleteAllSets, handleDeleteSet, handleEditSet, handleGetAllSetsForExercise, handleGetAllSetsForUser, handleGetMaxesForEachExercise, handleImportSetsFile, handleSetCreation } from "../controllers/setsController";
import authenticateToken from "../helpers/auth";



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
router.get("/getSets/:exercise_id", authenticateToken, (handleGetAllSetsForExercise))

router.get("/getMaxes", authenticateToken, (handleGetMaxesForEachExercise))

/* DELETE REQUESTS */
router.delete("/:set_id", authenticateToken, (handleDeleteSet))
router.delete("/", authenticateToken, (handleDeleteAllSets))

/* POST REQUESTS */
router.post("/createSet", authenticateToken, (handleSetCreation));
router.post("/import", authenticateToken,  upload.single("file"), (handleImportSetsFile));

/* PATCH REQUESTS */
router.patch("/:set_id", authenticateToken, (handleEditSet))


module.exports = router;