const express = require('express');
const Product = require('../models/Product');
const { verifyToken } = require('../middleware/authMiddleware');
const router = express.Router();

// CREATE: Add a new product (PROTECTED)
router.post('/', verifyToken, async (req, res) => {
  try {
    // We added the new fields here so the backend actually catches them!
    const { 
      title, 
      description, 
      fabricType, 
      price, 
      moq, 
      supplier, 
      images,
      availableColors,
      specifications,
      availableStock
    } = req.body; 
    
    const newProduct = new Product({
      title, 
      description, 
      fabricType, 
      price, 
      moq: moq || 1, 
      supplier,
      images: images || [],
      availableColors: availableColors || [], // <--- Catching Colors
      specifications: specifications || { width: "N/A", weight: "N/A", composition: "N/A" }, // <--- Catching Specs
      availableStock: availableStock || 0, // <--- Catching Live Inventory Count
      inStock: true // default new products to in-stock
    });
    
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error creating product:", error);
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

// ==========================================
// NEW ROUTES FOR INVENTORY MANAGEMENT
// ==========================================

// UPDATE: Edit a full product (PROTECTED)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { returnDocument: 'after' } // Returns the updated document
    );
    
    if (!updatedProduct) return res.status(404).json({ error: "Product not found" });
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: "Failed to update product" });
  }
});

// UPDATE: Toggle In-Stock status (PROTECTED)
router.patch('/:id', verifyToken, async (req, res) => {
  try {
    const { inStock } = req.body;
    
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { inStock },
      { returnDocument: 'after' }
    );
    
    if (!updatedProduct) return res.status(404).json({ error: "Product not found" });
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: "Failed to update stock status" });
  }
});

// DELETE: Remove a product (PROTECTED)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    
    if (!deletedProduct) return res.status(404).json({ error: "Product not found" });
    res.status(200).json({ message: "Product successfully deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

module.exports = router;