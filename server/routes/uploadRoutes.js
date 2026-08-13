const express = require('express');
const { upload } = require('../middleware/uploadMiddleware');
const { verifyToken } = require('../middleware/authMiddleware');
const router = express.Router();

// The "upload.single('image')" middleware intercepts the file and sends it to Cloudinary
router.post('/', verifyToken, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }
    console.log("Cloudinary returned this URL:", req.file.path);
    // Cloudinary automatically gives us back a secure URL to the hosted image!
    res.status(200).json({ imageUrl: req.file.path });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
});

module.exports = router;