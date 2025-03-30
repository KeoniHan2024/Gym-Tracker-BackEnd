import { handleMuscleGroupList } from "../controllers/musclegroupController";

const express = require('express');
const router = express.Router();


router.get("/", (handleMuscleGroupList));

module.exports = router;