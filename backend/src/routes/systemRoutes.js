// src/routes/systemRoutes.js
const express = require("express");
const { getSystemStatus, getAPIVersion, getServerTime } = require("../controllers/systemController");

const router = express.Router();

router.get("/status", getSystemStatus);
router.get("/version", getAPIVersion);
router.get("/time", getServerTime);

module.exports = router;
