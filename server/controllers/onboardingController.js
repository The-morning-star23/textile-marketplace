const { GoogleGenerativeAI } = require("@google/generative-ai");
const User = require("../models/User");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const processAIOnboarding = async (req, res) => {
  try {
    const { userId, description } = req.body;

    if (!description) {
      return res.status(400).json({ message: "Please provide a description." });
    }

    const prompt = `
      You are an AI data extractor for a B2B textile marketplace. 
      Read the following text from a new buyer and extract their preferences into a strict JSON format.
      
      Extract these exact keys:
      - businessType (e.g., Boutique, Manufacturer, Independent Designer)
      - industry (e.g., Fashion, Home Decor, Industrial)
      - categoriesOfInterest (Array of strings, e.g., ["Apparel", "Luxury Fabrics"])
      - preferredFabrics (Array of strings, e.g., ["Silk", "Organic Cotton", "Linen"])
      - typicalOrderQuantity (String, e.g., "50 meters")
      - budgetRange (String, e.g., "$15 - $30/meter")
      - additionalPreferences (String containing any extra notes, certifications, or custom requests mentioned)

      If a detail is missing, make your best logical guess based on context, or output "Not specified".
      Return ONLY valid JSON. Do not include markdown formatting like \`\`\`json.
      
      User Text: "${description}"
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });
    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    
    if (text.startsWith("```json")) text = text.replace("```json", "");
    if (text.endsWith("```")) text = text.replace("```", "");

    const extractedData = JSON.parse(text);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        preferences: extractedData,
        isOnboarded: true
      },
      { new: true }
    );

    res.status(200).json({ 
      message: "Onboarding successful!", 
      preferences: updatedUser.preferences,
      isOnboarded: updatedUser.isOnboarded
    });

  } catch (error) {
    console.error("Onboarding AI Error:", error);
    res.status(500).json({ message: "Failed to process onboarding data." });
  }
};

const saveManualOnboarding = async (req, res) => {
  try {
    const { userId, preferences } = req.body;
    
    // Clean up comma-separated strings into arrays where needed (Plain JS syntax)
    const formattedPreferences = {
      ...preferences,
      categoriesOfInterest: typeof preferences.categoriesOfInterest === 'string' 
        ? preferences.categoriesOfInterest.split(',').map(s => s.trim()) 
        : preferences.categoriesOfInterest,
      preferredFabrics: typeof preferences.preferredFabrics === 'string' 
        ? preferences.preferredFabrics.split(',').map(s => s.trim()) 
        : preferences.preferredFabrics,
    };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        preferences: formattedPreferences,
        isOnboarded: true
      },
      { new: true }
    );

    res.status(200).json({ 
      message: "Manual onboarding successful!", 
      preferences: updatedUser.preferences,
      isOnboarded: updatedUser.isOnboarded
    });
  } catch (error) {
    console.error("Manual Onboarding Error:", error);
    res.status(500).json({ message: "Failed to save profile." });
  }
};

module.exports = { processAIOnboarding, saveManualOnboarding };