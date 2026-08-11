const express = require('express');
const router = express.Router();
const { getSupplierProfile, updateSupplierProfile } = require('../controllers/supplierController');
const { verifyToken } = require('../middleware/authMiddleware'); 

// Profile routes
router.get('/profile', verifyToken, getSupplierProfile);
router.put('/profile', verifyToken, updateSupplierProfile);

module.exports = router;