const Appointment = require("../models/appointmentModel");
const User = require("../models/userModel");
const Notification = require("../models/notificationModel");
const { sendNotificationToUser } = require("../config/socket");

exports.bookAppointment = async (req, res, next) => {
  try {
    const patient = await User.findOne({ firebaseUid: req.user.uid });
    if (!patient) return res.status(400).json({ message: "Patient not found" });

    const { doctorId, datetime, notes } = req.body;
    const appt = await Appointment.create({
      patient: patient._id,
      doctor: doctorId,
      datetime,
      notes,
    });

    // Get doctor details
    const doctor = await User.findById(doctorId);
    
    // Send real-time notification to doctor
    if (doctor && doctor.firebaseUid) {
      const notification = await Notification.create({
        recipientId: doctor.firebaseUid,
        recipientRole: 'doctor',
        senderId: patient.firebaseUid,
        senderRole: 'patient',
        type: 'appointment_request',
        title: 'New Appointment Request',
        message: `${patient.name || 'A patient'} has requested an appointment for ${new Date(datetime).toLocaleDateString()}`,
        icon: '📅',
        actionScreen: 'PatientRequests',
        priority: 'high'
      });
      
      sendNotificationToUser(doctor.firebaseUid, notification);
    }

    res.status(201).json(appt);
  } catch (err) {
    next(err);
  }
};

exports.getAppointmentsByUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    
    // Firestore doesn't support $or, so we query both ways
    const asPatient = await Appointment.find({ patient: user._id });
    const asDoctor = await Appointment.find({ doctor: user._id });
    
    // Combine and remove duplicates
    const appointmentsMap = new Map();
    [...asPatient, ...asDoctor].forEach(appt => {
      appointmentsMap.set(appt._id, appt);
    });
    
    const appts = Array.from(appointmentsMap.values());
    res.json(appts);
  } catch (err) {
    next(err);
  }
};

exports.cancelAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);
    
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const user = await User.findOne({ firebaseUid: req.user.uid });
    
    // Get patient and doctor details manually (no populate in Firestore)
    const patient = await User.findById(appointment.patient);
    const doctor = await User.findById(appointment.doctor);
    
    // Determine who to notify (doctor or patient)
    let recipientId, recipientRole, senderName;
    if (appointment.patient === user._id) {
      // Patient cancelled, notify doctor
      recipientId = doctor?.firebaseUid;
      recipientRole = 'doctor';
      senderName = patient?.name || 'A patient';
    } else {
      // Doctor cancelled, notify patient
      recipientId = patient?.firebaseUid;
      recipientRole = 'patient';
      senderName = doctor?.name || 'Doctor';
    }

    // Send notification
    if (recipientId) {
      const notification = await Notification.create({
        recipientId: recipientId,
        recipientRole: recipientRole,
        senderId: user.firebaseUid,
        senderRole: user.role,
        type: 'appointment_cancelled',
        title: 'Appointment Cancelled',
        message: `${senderName} has cancelled the appointment scheduled for ${new Date(appointment.datetime).toLocaleDateString()}`,
        icon: '❌',
        actionScreen: recipientRole === 'doctor' ? 'PatientRequests' : 'Appointments',
        priority: 'high'
      });
      
      sendNotificationToUser(recipientId, notification);
    }

    await Appointment.findByIdAndDelete(id);
    res.json({ message: "Appointment cancelled successfully" });
  } catch (err) {
    next(err);
  }
};

exports.getAllAppointments = async (req, res, next) => {
  try {
    const appts = await Appointment.find();
    res.json(appts);
  } catch (err) {
    next(err);
  }
};

// Update appointment status (e.g., doctor accepts a request)
exports.updateAppointmentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
};
