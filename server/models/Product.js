const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  supplier: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  fabricType: { type: String },
  colors: [{ type: String }],
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  images: [{ type: String }], // We will store image URLs here
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);