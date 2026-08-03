const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/authMiddleware');
const router = express.Router();

// REGISTER ROUTE
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Create user (Note: In a real app, ALWAYS hash the password with bcrypt here!)
    const newUser = new User({ name, email, password, role });
    const savedUser = await newUser.save();

    // Generate JWT Token
    const token = jwt.sign(
      { id: savedUser._id, role: savedUser.role }, 
      JWT_SECRET, 
      { expiresIn: '1d' } // Token expires in 1 day
    );

    res.status(201).json({ 
      user: savedUser,
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

    // Check password (In reality, use bcrypt.compare)
    if (user.password !== password) {
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

module.exports = router;