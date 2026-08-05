const { GoogleGenerativeAI } = require("@google/generative-ai");
const Product = require("../models/Product");

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateAIResponse = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Please provide a message for the AI." });
    }

    // 1. Fetch all products from the database so the AI knows what we sell
    const products = await Product.find().populate("supplier", "name");

    // 2. Format the catalog into a readable string for the AI
    const catalogContext = products.map(p => 
      `Product Name: ${p.title}
       Type: ${p.fabricType}
       Price: $${p.price}/meter
       Description: ${p.description}
       Supplier: ${p.supplier?.name || "Unknown"}
       ---`
    ).join("\n");

    // 3. Build the master prompt (System Instructions + Context + User Message)
    const prompt = `
      You are the official AI Shopping Assistant for "ThreadMarket", a premium B2B textile marketplace.
      Your job is to help buyers find fabrics, compare products, answer questions, and make recommendations.
      
      Here is the current real-time inventory of ThreadMarket:
      ${catalogContext}

      Rules:
      1. ONLY recommend or discuss products that exist in the inventory above.
      2. If a user asks for something we don't have, politely apologize and suggest the closest alternative we DO have.
      3. Keep your answers concise, friendly, and formatted nicely. Do not use complex formatting, just standard text and simple lists if needed.
      4. If the user asks to compare, compare the prices, types, and descriptions of the available products.

      User's Message: "${message}"
      
      Your Helpful Response:
    `;

    // 4. Call the Gemini 1.5 Flash model
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ reply: text });
  } catch (error) {
    console.error("AI Assistant Error:", error);
    res.status(500).json({ message: "The AI assistant is currently unavailable. Please try again later." });
  }
};

module.exports = { generateAIResponse };