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
        name: { type: String, required: true },       // e.g., "Crimson Red"
        hexCode: { type: String, default: "#000000" }, // e.g., "#DC143C" (for the swatch)
        imageUrl: { type: String }                    // The specific image for this color
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
    // --- INVENTORY MANAGEMENT ---
    inStock: {
      type: Boolean,
      default: true, // New products are in-stock by default
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);