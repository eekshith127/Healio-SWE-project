const axios = require("axios");

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_MODEL = "nvidia/nemotron-nano-9b-v2:free";
const SYSTEM_PROMPT =
  "You are a friendly medical assistant. You provide only basic health information, general wellness tips, and simple explanations. You do NOT diagnose medical conditions, prescribe medications, or replace professional medical advice.";

exports.getChatbotResponse = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!OPENROUTER_API_KEY) {
      return res
        .status(500)
        .json({ message: "Chatbot is not configured. Missing OpenRouter API key." });
    }

    if (!message || typeof message !== "string") {
      return res.status(400).json({ message: "Message is required." });
    }

    const response = await axios.post(
      OPENROUTER_URL,
      {
        model: OPENROUTER_MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: message },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    const reply =
      response.data &&
      response.data.choices &&
      response.data.choices[0] &&
      response.data.choices[0].message &&
      response.data.choices[0].message.content
        ? response.data.choices[0].message.content
        : "Sorry, I could not generate a response.";

    return res.json({ reply });
  } catch (err) {
    next(err);
  }
};
