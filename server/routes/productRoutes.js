const express = require('express');
const jwt = require('jsonwebtoken');
const Product = require('../models/Product');
const User = require('../models/User');
const { verifyToken } = require('../middleware/authMiddleware');
const router = express.Router();

// CREATE: Add a new product (PROTECTED)
router.post('/', verifyToken, async (req, res) => {
  try {
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
      availableColors: availableColors || [], 
      specifications: specifications || { width: "N/A", weight: "N/A", composition: "N/A" }, 
      availableStock: availableStock || 0, 
      inStock: true 
    });
    
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
});

// READ: Get all products for the marketplace (SMART AI FEED)
router.get('/', async (req, res) => {
  try {
    // 1. Fetch all products as plain JavaScript objects using .lean()
    let products = await Product.find()
      .populate('supplier', 'name') 
      .lean(); 

    // 2. Check if a user is logged in by looking for the token
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      
      try {
        // Decode token and find the specific buyer
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id || decoded._id);

        if (user) {
          // --- AI MATCHMAKING ALGORITHM ---
          const preferredFabrics = user.fabricTypes || [];
          const preferredCategories = user.productCategories || [];
          const topCategories = user.topCategories || [];
          const recentSearches = user.recentSearches || [];

          products = products.map(product => {
            let score = 0;
            const productText = `${product.title} ${product.description} ${product.fabricType}`.toLowerCase();

            // Point System:
            // +10 Points if it matches their exact preferred fabric type or historically viewed categories
            if (preferredFabrics.includes(product.fabricType) || topCategories.includes(product.fabricType)) {
              score += 10;
            }

            // +5 Points if it matches their general business category
            if (preferredCategories.includes(product.fabricType)) {
              score += 5;
            }

            // +8 Points if the product description contains keywords they recently searched for
            recentSearches.forEach(search => {
              if (search && productText.includes(search.toLowerCase())) {
                score += 8;
              }
            });

            return { ...product, matchScore: score };
          });

          // Sort by the highest AI match score first. If tied, show the newest product.
          products.sort((a, b) => {
            if (b.matchScore !== a.matchScore) {
              return b.matchScore - a.matchScore;
            }
            return new Date(b.createdAt) - new Date(a.createdAt);
          });

          return res.status(200).json(products);
        }
      } catch (tokenErr) {
        console.log("Token invalid or expired. Falling back to standard feed.");
      }
    }

    // 3. FALLBACK: If no user is logged in, sort chronologically (Newest First)
    products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.status(200).json(products);

  } catch (error) {
    console.error("Marketplace Feed Error:", error);
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

// UPDATE: Edit a full product (PROTECTED)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { returnDocument: 'after' } 
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