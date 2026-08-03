const express = require('express');
const Order = require('../models/Order');
const { verifyToken } = require('../middleware/authMiddleware');
const router = express.Router();

// 1. CREATE: Place a new order (PROTECTED)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { buyer, supplier, product, quantity, totalPrice, shippingAddress } = req.body;
    const newOrder = new Order({ buyer, supplier, product, quantity, totalPrice, shippingAddress });
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ error: "Failed to place order" });
  }
});

// 2. READ: Get all orders for a specific BUYER (PROTECTED)
router.get('/buyer/:buyerId', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.params.buyerId })
      .populate('product', 'title fabricType price images')
      .populate('supplier', 'name')
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// 3. READ: Get all orders for a specific SUPPLIER (PROTECTED)
router.get('/supplier/:supplierId', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ supplier: req.params.supplierId })
      .populate('product', 'title fabricType price')
      .populate('buyer', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// 4. UPDATE: Change order status (PROTECTED)
router.put('/:orderId/status', verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: "Failed to update order status" });
  }
});

module.exports = router;