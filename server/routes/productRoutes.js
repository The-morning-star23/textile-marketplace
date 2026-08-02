const express = require('express');
const { createProduct, getSupplierProducts, getAllProducts } = require('../controllers/productController');
const { protect, supplierOnly } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
  .post(protect, supplierOnly, createProduct)
  .get(getAllProducts); // Public route for buyers to see the marketplace

router.get('/supplier', protect, supplierOnly, getSupplierProducts);

module.exports = router;