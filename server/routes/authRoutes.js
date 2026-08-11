const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/authMiddleware');
const router = express.Router();
const bcryptjs = require('bcryptjs');

// 1. IMPORT OUR BULLETPROOF ONBOARDING CONTROLLERS
const { processAIOnboarding, saveManualOnboarding } = require('../controllers/onboardingController');

// REGISTER ROUTE
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Create user (Your User model automatically hashes the password before saving)
    const newUser = new User({ name, email, password, role });
    const savedUser = await newUser.save();

    // Generate JWT Token
    const token = jwt.sign(
      { id: savedUser._id, role: savedUser.role }, 
      JWT_SECRET, 
      { expiresIn: '1d' } // Token expires in 1 day
    );

    res.status(201).json({ 
      user: savedUser, // This now safely includes isOnboarded: false for the frontend
      token: token 
    });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
});

// LOGIN ROUTE
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Use bcryptjs to securely compare the typed password against the stored hash
    const isMatch = await bcryptjs.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      JWT_SECRET, 
      { expiresIn: '1d' }
    );

    res.status(200).json({ 
      user: user,
      token: token 
    });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

// 2. PLUG IN THE ONBOARDING CONTROLLERS
// These will now correctly process the JSON, talk to Gemini, and save everything to the database!
router.put('/onboard', saveManualOnboarding);
router.post('/onboard/ai', processAIOnboarding);

module.exports = router;