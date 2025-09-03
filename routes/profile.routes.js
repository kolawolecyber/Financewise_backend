const express = require("express");
const router = express.Router();
const { getUserSettings, updateUserSettings } = require("../controllers/profile.controller");
const {verifyToken} = require("../middleware/expenseAuthMiddleware");
const  upload = require( "../middleware/upload");

// Get user settings
router.get("/settings", verifyToken, getUserSettings);

// Updae user settings
router.put("/settings", verifyToken,upload.single('profilePic'), updateUserSettings);

module.exports = router;
