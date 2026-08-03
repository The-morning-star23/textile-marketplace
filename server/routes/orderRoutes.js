const express = require('express');
const Order = require('../models/Order');
const router = express.Router();

// 1. CREATE: Place a new order (Buyer action)
router.post('/', async (req, res) => {
  try {
    const { buyer, supplier, product, quantity, totalPrice, shippingAddress } = req.body;
    
    const newOrder = new Order({
      buyer,
      supplier,
      product,
      quantity,
      totalPrice,
      shippingAddress
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to place order" });
  }
});

// 2. READ: Get all orders for a specific BUYER
router.get('/buyer/:buyerId', async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.params.buyerId })
      .populate('product', 'title fabricType price images') // Bring in product details
      .populate('supplier', 'name') // Bring in supplier name
      .sort({ createdAt: -1 });
      
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching buyer orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// 3. READ: Get all orders for a specific SUPPLIER
router.get('/supplier/:supplierId', async (req, res) => {
  try {
    const orders = await Order.find({ supplier: req.params.supplierId })
      .populate('product', 'title fabricType price')
      .populate('buyer', 'name email') // Bring in buyer contact info
      .sort({ createdAt: -1 });
      
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching supplier orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// 4. UPDATE: Change order status (Supplier action)
router.put('/:orderId/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status },
      { new: true } // Returns the updated document
    );
    
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Failed to update order status" });
  }
});

module.exports = router;