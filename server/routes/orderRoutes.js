const express = require('express');
const Order = require('../models/Order');
const { verifyToken } = require('../middleware/authMiddleware');
const router = express.Router();

// CREATE: Place a new order (Buyer)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { buyer, supplier, product, quantity, totalPrice, shippingAddress } = req.body;
    const newOrder = new Order({
      buyer, supplier, product, quantity, totalPrice, shippingAddress
    });
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ error: "Failed to place order" });
  }
});

// READ: Get all orders for a specific buyer
router.get('/buyer/:buyerId', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.params.buyerId })
      .populate('product')
      .populate('supplier', 'name')
      .sort({ createdAt: -1 }); // Newest first
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch buyer orders" });
  }
});

// READ: Get all orders for a specific supplier
router.get('/supplier/:supplierId', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ supplier: req.params.supplierId })
      .populate('product')
      .populate('buyer', 'name email') // Fetch the buyer's contact info!
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch supplier orders" });
  }
});

// UPDATE: Change Order Status (Supplier)
router.patch('/:id/status', verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    
    // Find the order by ID and update its status
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true } // Returns the updated document
    );
    
    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: "Failed to update order status" });
  }
});

module.exports = router;