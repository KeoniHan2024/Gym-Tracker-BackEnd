import {
  handleAddBodyweight,
  handleDeleteAllBodyweights,
  handleDeleteBodyweight,
  handleEditBodyweight,
  handleGetUserBodyweightHistory,
  handleImportBodyweightFile,
} from "../controllers/bodyweightController";
import authenticateToken from "../helpers/auth";

const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // Files saved in 'uploads/'


// delete routes
router.delete(
  "/",
  authenticateToken,
  handleDeleteAllBodyweights
);

router.delete("/:bodyweight_id", authenticateToken, handleDeleteBodyweight)


// POST routes
router.post("/create", authenticateToken, handleAddBodyweight);
router.post(
  "/import",
  authenticateToken,
  upload.single("file"), // Multer middleware (expects a file with field name "file")
  handleImportBodyweightFile
);

// PATCH routes
router.patch("/:bodyweight_id", authenticateToken, handleEditBodyweight)

// GET routes
router.get("/", authenticateToken, handleGetUserBodyweightHistory);

module.exports = router;
