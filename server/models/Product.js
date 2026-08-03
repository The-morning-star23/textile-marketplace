const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  supplier: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  fabricType: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  moq: { 
    type: Number, 
    required: true,
    description: "Minimum Order Quantity (e.g., in meters)"
  },
  inStock: { 
    type: Boolean, 
    default: true 
  },
  images: [{ 
    type: String 
  }] // We will store image URLs here later
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);