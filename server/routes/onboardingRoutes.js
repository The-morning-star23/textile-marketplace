const express = require("express");
const router = express.Router();
const { processAIOnboarding, saveManualOnboarding } = require("../controllers/onboardingController");

router.post("/process", processAIOnboarding);
router.post("/manual", saveManualOnboarding);

module.exports = router;