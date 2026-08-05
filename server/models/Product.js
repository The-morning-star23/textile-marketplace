const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    fabricType: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // --- NEW PRODUCT DETAIL FIELDS ---
    availableColors: [
      {
        type: String,
      },
    ],
    specifications: {
      width: { type: String, default: "N/A" },
      weight: { type: String, default: "N/A" },
      composition: { type: String, default: "N/A" },
    },
    moq: {
      type: Number,
      default: 1,
    },
    availableStock: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);