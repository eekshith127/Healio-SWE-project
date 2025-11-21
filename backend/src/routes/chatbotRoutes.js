// src/routes/chatbotRoutes.js
const express = require("express");
const { getChatbotResponse } = require("../controllers/chatbotController");
const firebaseAuthCheck = require("../middleware/firebaseAuthCheck");

const router = express.Router();

// Auth optional if chatbot is public, otherwise enable:
// router.use(firebaseAuthCheck);

router.post("/", getChatbotResponse);

module.exports = router;
