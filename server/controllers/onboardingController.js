const { GoogleGenerativeAI } = require("@google/generative-ai");
const User = require("../models/User");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const processAIOnboarding = async (req, res) => {
  try {
    const userId = req.body.userId || (req.user && (req.user._id || req.user.id));
    const { description } = req.body;

    if (!userId) return res.status(400).json({ message: "User ID is required." });
    if (!description) return res.status(400).json({ message: "Please provide a description." });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    const isSupplier = user.role === "supplier";

    const prompt = isSupplier 
      ? `You are a strict data extractor. Extract business details from the text into JSON.
         Keys MUST be exactly: "businessName", "businessType", "contactEmail", "phoneNumber", "businessAddress", "operatingHours", "productCategories" (array of strings), "fabricTypes" (array of strings), "moq", "gstinNumber", "website".
         If a detail is missing, leave strings empty "" and arrays empty [].
         Text: "${description}"
         Output ONLY a valid JSON object. No markdown, no conversational text.`
      : `You are a strict data extractor. Extract buyer preferences into JSON.
         Keys MUST be exactly: "businessType", "industry", "categoriesOfInterest" (array), "preferredFabrics" (array), "typicalOrderQuantity", "budgetRange", "additionalPreferences".
         If a detail is missing, use "Not specified".
         Text: "${description}"
         Output ONLY a valid JSON object. No markdown, no conversational text.`;

    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });
    const result = await model.generateContent(prompt);
    let text = result.response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("AI did not return a valid JSON object. Raw output: " + text);
    }
    
    // Here is where the AI data is stored!
    const extractedData = JSON.parse(jsonMatch[0]);
    let updateData = { isOnboarded: true };

    if (isSupplier) {
      updateData.businessName = extractedData.businessName || "";
      updateData.businessType = extractedData.businessType || "";
      
      if (extractedData.contactEmail) {
        updateData.email = extractedData.contactEmail; 
      }
      
      updateData.phoneNumber = extractedData.phoneNumber || "";
      updateData.businessAddress = extractedData.businessAddress || "";
      updateData.operatingHours = extractedData.operatingHours || "";
      updateData.productCategories = Array.isArray(extractedData.productCategories) ? extractedData.productCategories : [];
      updateData.fabricTypes = Array.isArray(extractedData.fabricTypes) ? extractedData.fabricTypes : [];
      updateData.moq = extractedData.moq || "";
      updateData.gstinNumber = extractedData.gstinNumber || "";
      updateData.website = extractedData.website || "";
    } else {
      updateData.preferences = extractedData;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

    // Send the contactEmail back correctly to the frontend
    res.status(200).json({ 
      message: "AI Onboarding successful!", 
      data: isSupplier ? { ...updateData, contactEmail: updatedUser.email } : updatedUser.preferences,
      isOnboarded: updatedUser.isOnboarded
    });

  } catch (error) {
    console.error("Onboarding AI Error:", error);
    res.status(500).json({ message: "Failed to process AI data.", error: error.message });
  }
};

const saveManualOnboarding = async (req, res) => {
  try {
    const userId = req.body.userId || (req.user && (req.user._id || req.user.id));
    const data = req.body; 

    if (!userId) return res.status(400).json({ message: "User ID is required." });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    let updateData = { isOnboarded: true };

    if (user.role === "supplier") {
      updateData.businessName = data.businessName || data.preferences?.businessName || "";
      updateData.businessType = data.businessType || data.preferences?.businessType || "";
      
      if (data.contactEmail || data.preferences?.contactEmail) {
        updateData.email = data.contactEmail || data.preferences?.contactEmail;
      }

      updateData.phoneNumber = data.phoneNumber || data.preferences?.phoneNumber || "";
      updateData.businessAddress = data.businessAddress || data.preferences?.businessAddress || "";
      updateData.operatingHours = data.operatingHours || data.preferences?.operatingHours || "";
      updateData.productCategories = data.productCategories || data.categories || [];
      
      let rawFabrics = data.fabricTypes || data.preferences?.fabricTypes;
      if (typeof rawFabrics === 'string') {
        updateData.fabricTypes = rawFabrics.split(',').map(s => s.trim());
      } else if (Array.isArray(rawFabrics)) {
        updateData.fabricTypes = rawFabrics;
      } else {
        updateData.fabricTypes = [];
      }

      updateData.moq = data.moq || data.preferences?.moq || "";
      updateData.gstinNumber = data.gstinNumber || data.preferences?.gstinNumber || "";
      updateData.website = data.website || data.preferences?.website || "";
    } else {
      const prefs = data.preferences || data;
      updateData.preferences = {
        ...prefs,
        categoriesOfInterest: typeof prefs.categoriesOfInterest === 'string' 
          ? prefs.categoriesOfInterest.split(',').map(s => s.trim()) 
          : prefs.categoriesOfInterest,
        preferredFabrics: typeof prefs.preferredFabrics === 'string' 
          ? prefs.preferredFabrics.split(',').map(s => s.trim()) 
          : prefs.preferredFabrics,
      };
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

    res.status(200).json({ 
      message: "Manual onboarding successful!", 
      data: user.role === "supplier" ? { ...updateData, contactEmail: updatedUser.email } : updatedUser.preferences,
      isOnboarded: updatedUser.isOnboarded
    });
  } catch (error) {
    console.error("Manual Onboarding Error:", error);
    res.status(500).json({ message: "Failed to save profile.", error: error.message });
  }
};

module.exports = { processAIOnboarding, saveManualOnboarding };