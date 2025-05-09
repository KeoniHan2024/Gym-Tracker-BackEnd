import {
  handleAddBodyweight,
  handleGetUserBodyweightHistory,
  handleImportBodyweightFile,
} from "../controllers/bodyweightController";
import authenticateToken from "../helpers/auth";

const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // Files saved in 'uploads/'

router.post(
  "/import",
  authenticateToken,
  upload.single("file"), // Multer middleware (expects a file with field name "file")
  handleImportBodyweightFile
);


// POST routes
router.post("/create", authenticateToken, handleAddBodyweight);

// GET routes
router.get("/", authenticateToken, handleGetUserBodyweightHistory);

module.exports = router;
