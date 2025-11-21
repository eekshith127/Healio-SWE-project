// src/middleware/roleCheck.js

/**
 * Role-based access control middleware
 * Supports roles: "admin", "doctor", "lab", "patient"
 */

function verifyAdmin(req, res, next) {
  const user = req.user; // FirebaseAuthCheck sets req.user
  if (!user || user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
}

function verifyDoctor(req, res, next) {
  const user = req.user;
  if (!user || user.role !== "doctor") {
    return res.status(403).json({ message: "Access denied. Doctors only." });
  }
  next();
}

function verifyLabTech(req, res, next) {
  const user = req.user;
  if (!user || user.role !== "lab") {
    return res.status(403).json({ message: "Access denied. Lab technicians only." });
  }
  next();
}

function verifyPatient(req, res, next) {
  const user = req.user;
  if (!user || user.role !== "patient") {
    return res.status(403).json({ message: "Access denied. Patients only." });
  }
  next();
}

module.exports = { verifyAdmin, verifyDoctor, verifyLabTech, verifyPatient };
