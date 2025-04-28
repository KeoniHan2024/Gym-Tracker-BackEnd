import { handleAddBodyweight } from "../controllers/bodyweightController";
import authenticateToken from "../helpers/auth";



const express = require('express');
const router = express.Router();



// POST routes
router.post("/create", authenticateToken, (handleAddBodyweight));


module.exports = router;