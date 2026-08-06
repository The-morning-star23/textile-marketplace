const express = require("express");
const router = express.Router();
const { generateAIResponse } = require("../controllers/aiController");
// Secure this route using verifyToken
router.post("/chat", generateAIResponse);

module.exports = router;