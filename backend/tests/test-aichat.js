require("dotenv").config();

const { generateAIResponse } = require("../services/aiChat.service");

(async () => {
  const response = await generateAIResponse({
    state: "PRODUCT_PITCH",
    ragContext: " sells Tops Urban Wear Trichy",
    userMessage: "I want a budget option"
  });

  console.log("\nAI RESPONSE:\n", response);
})();
