const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// CREATE: Add a new product to the marketplace
router.post('/', async (req, res) => {
  try {
    const { supplier, title, description, fabricType, price, moq, images } = req.body;
    
    const newProduct = new Product({
      supplier,
      title,
      description,
      fabricType,
      price,
      moq,
      images
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
});

// READ: Get all products for a specific supplier
router.get('/supplier/:supplierId', async (req, res) => {
  try {
    // Find all products matching the supplier ID, sorted newest first
    const products = await Product.find({ supplier: req.params.supplierId }).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching supplier products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});


// READ: Get ALL products for the marketplace (for Buyers)
router.get('/', async (req, res) => {
  try {
    // used .populate() to get the supplier's name along with the product
    const products = await Product.find()
      .populate('supplier', 'name') 
      .sort({ createdAt: -1 }); // Newest first
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching all products:", error);
    res.status(500).json({ error: "Failed to fetch marketplace products" });
  }
});

// READ: Get a single product by ID (For the checkout page)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('supplier', 'name');
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

module.exports = router;