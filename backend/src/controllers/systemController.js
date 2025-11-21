// src/controllers/systemController.js

// ✅ System status (basic health check)
exports.getSystemStatus = (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date(),
  });
};

// ✅ API version info
exports.getAPIVersion = (req, res) => {
  res.json({
    name: "Healio Backend API",
    version: "1.0.0",
    description: "Backend service for Healio app",
  });
};

// ✅ Server time endpoint
exports.getServerTime = (req, res) => {
  res.json({
    serverTime: new Date().toISOString(),
  });
};
