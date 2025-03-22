const express = require('express');
const router = express.Router();
import { handleCreateUser, handleLoginUser } from '../controllers/userController';


router.post("/create", (handleCreateUser));
router.post("/login", (handleLoginUser));

module.exports = router;