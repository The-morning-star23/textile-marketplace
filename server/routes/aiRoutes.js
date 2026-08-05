const express = require("express");
const router = express.Router();
const { generateAIResponse } = require("../controllers/aiController");
const { verifyToken } = require("../middleware/authMiddleware");
// Secure this route using verifyToken
router.post("/chat", verifyToken, generateAIResponse);

module.exports = router;