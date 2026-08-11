const User = require('../models/User');

const getSupplierProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id || req.user.id);
    if (!user) return res.status(404).json({ message: "Supplier not found" });

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching supplier profile:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

const updateSupplierProfile = async (req, res) => {
  try {
    const { 
      businessName, contactEmail, phoneNumber, businessAddress, 
      operatingHours, gstinNumber, website,
      businessType, productCategories, fabricTypes, moq 
    } = req.body;
    
    // Ensure comma-separated strings are turned back into arrays for the database
    const formatArray = (input) => {
      if (Array.isArray(input)) return input;
      if (typeof input === 'string') return input.split(',').map(s => s.trim()).filter(Boolean);
      return [];
    };

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id || req.user.id,
      {
        businessName,
        email: contactEmail, 
        phoneNumber,
        businessAddress,
        operatingHours,
        gstinNumber,
        website,
        businessType,
        productCategories: formatArray(productCategories),
        fabricTypes: formatArray(fabricTypes),
        moq
      },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating supplier profile:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

module.exports = { getSupplierProfile, updateSupplierProfile };