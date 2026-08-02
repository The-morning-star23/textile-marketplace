const Product = require('../models/Product');

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Supplier
exports.createProduct = async (req, res) => {
  try {
    const { name, description, category, fabricType, colors, price, stock, images } = req.body;
    
    const product = await Product.create({
      supplier: req.user._id,
      name, description, category, fabricType, colors, price, stock, images
    });
    
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all products for the logged-in supplier
// @route   GET /api/products/supplier
// @access  Private/Supplier
exports.getSupplierProducts = async (req, res) => {
  try {
    const products = await Product.find({ supplier: req.user._id }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all public products for the marketplace
// @route   GET /api/products
// @access  Public
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ stock: { $gt: 0 } }).populate('supplier', 'name');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};