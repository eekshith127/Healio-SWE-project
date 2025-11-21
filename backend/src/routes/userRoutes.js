// src/routes/userRoutes.js
const express = require("express");
const { getAllUsers, getUserById, updateUserProfile, deleteUser, syncUser, getDoctors } = require("../controllers/userController");
const firebaseAuthCheck = require("../middleware/firebaseAuthCheck");
const { verifyAdmin } = require("../middleware/roleCheck");

const router = express.Router();

// Sync user - public endpoint for registration
router.post("/sync", syncUser);

// All other user routes require authentication
router.use(firebaseAuthCheck);

// Routes
router.get("/doctors", getDoctors);                 // Public: Get doctors
router.get("/", verifyAdmin, getAllUsers);          // Admin-only
router.get("/:id", getUserById);                    // Fetch profile
router.put("/:id", updateUserProfile);              // Update profile
router.delete("/:id", verifyAdmin, deleteUser);     // Admin-only

module.exports = router;
