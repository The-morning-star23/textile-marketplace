const express = require('express');
const Order = require('../models/Order');
const { verifyToken } = require('../middleware/authMiddleware');
const Product = require('../models/Product');
const router = express.Router();

// CREATE: Place a new order (Buyer Checkout)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;
    
    // Securely get the buyer ID from the verified token
    const buyerId = req.user.id || req.user._id;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "No items in cart" });
    }

    const createdOrders = [];

    // Loop through the cart items and create an independent order for each
    for (const item of items) {
      const newOrder = new Order({
        buyer: buyerId,
        supplier: item.supplierId,
        product: item.productId,
        color: item.color,
        image: item.image,
        quantity: item.quantity,
        totalPrice: item.price * item.quantity, // Calculate item subtotal
        shippingAddress: shippingAddress,
        status: 'Pending'
      });
      
      const savedOrder = await newOrder.save();
      createdOrders.push(savedOrder);
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { availableStock: -item.quantity } // $inc with a negative number subtracts it!
      });
    }

    res.status(201).json({ message: "Orders placed successfully", orders: createdOrders });
  } catch (error) {
    console.error("Checkout Error:", error);
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
      .populate('buyer', 'name email') // Fetch the buyer's contact info
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