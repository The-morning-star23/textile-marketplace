const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// 1. Log in to Cloudinary using your .env credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Configure where and how the files are saved
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'textile_marketplace_products', // This creates a specific folder in your Cloudinary!
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, height: 800, crop: 'limit' }], // Automatically resize huge images
  },
});

// 3. Create the multer middleware
const upload = multer({ storage: storage });

module.exports = { upload, cloudinary };