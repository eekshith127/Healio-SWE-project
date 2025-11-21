// src/controllers/userController.js
const User = require("../models/userModel");

/**
 * POST /api/users/sync
 * Sync user from Firebase to MongoDB (called during registration)
 */
exports.syncUser = async (req, res) => {
  try {
    console.log('Sync user request received:', req.body);
    const { firebaseUid, email, role, name, phone } = req.body;
    
    if (!firebaseUid || !email || !role) {
      console.log('Missing required fields:', { firebaseUid, email, role });
      return res.status(400).json({ message: "Missing required fields" });
    }

    console.log('Checking if user exists...');
    // Check if user already exists
    let user = await User.findOne({ firebaseUid });
    
    if (user) {
      console.log('User exists, updating without changing role...');
      // Update existing user but KEEP their current role
      const updates = {
        email,
        name: name || user.name,
        phone: phone || user.phone,
      };
      user = await User.findByIdAndUpdate(user._id, updates, { new: true });
      return res.status(200).json({ message: "User updated", user });
    } else {
      console.log('User does not exist, creating new user...');
      // Create new user
      user = await User.create({
        firebaseUid,
        email,
        role,
        name: name || email.split('@')[0],
        phone,
      });
      console.log('User created successfully:', user);
      return res.status(201).json({ message: "User created", user });
    }
  } catch (error) {
    console.error('Sync user error:', error);
    res.status(500).json({ message: "Failed to sync user", error: error.message });
  }
};

/**
 * GET /api/users
 * Admin: Get all users
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password"); // exclude password field
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
};

/**
 * GET /api/users/doctors
 * Public (authenticated): Get all doctors
 */
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' });
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch doctors", error: error.message });
  }
};

/**
 * GET /api/users/:id
 * Fetch a specific user by ID
 */
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id, "-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user", error: error.message });
  }
};

/**
 * PUT /api/users/:id
 * Update a user profile (self or admin)
 */
exports.updateUserProfile = async (req, res) => {
  try {
    const { name, phone, specialization } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, phone, specialization },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "Profile updated", user });
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
};

/**
 * DELETE /api/users/:id
 * Admin: Delete a user account
 */
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user", error: error.message });
  }
};
