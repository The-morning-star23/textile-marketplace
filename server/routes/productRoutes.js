const express = require('express');
const Product = require('../models/Product');
const { verifyToken } = require('../middleware/authMiddleware');
const router = express.Router();

// CREATE: Add a new product (PROTECTED)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, description, fabricType, price, moq, supplier, images } = req.body; 
    
    const newProduct = new Product({
      title, 
      description, 
      fabricType, 
      price, 
      moq, 
      supplier,
      images: images || []
    });
    
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ error: "Failed to create product" });
  }
});

// READ: Get all products for the marketplace (OPEN - Anyone can browse)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find()
      .populate('supplier', 'name') 
      .sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch marketplace products" });
  }
});

// READ: Get all products for a specific supplier (OPEN)
router.get('/supplier/:supplierId', async (req, res) => {
  try {
    const products = await Product.find({ supplier: req.params.supplierId }).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// READ: Get a single product by ID (OPEN)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('supplier', 'name');
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

module.exports = router;