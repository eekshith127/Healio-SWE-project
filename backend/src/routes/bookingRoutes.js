// src/routes/bookingRoutes.js
const express = require("express");
const {
  bookAppointment,
  getAppointmentsByUser,
  cancelAppointment,
  getAllAppointments,
  updateAppointmentStatus,
} = require("../controllers/bookingController");
const firebaseAuthCheck = require("../middleware/firebaseAuthCheck");
const { verifyDoctor, verifyAdmin } = require("../middleware/roleCheck");

const router = express.Router();

router.use(firebaseAuthCheck);

// Patient routes
router.post("/", bookAppointment);
router.get("/my", getAppointmentsByUser);
router.patch("/:id", updateAppointmentStatus);
router.delete("/:id", cancelAppointment);

// Doctor/Admin routes
router.get("/all", verifyDoctor, getAllAppointments);

module.exports = router;
