const Notification = require('../models/notificationModel');
const { sendNotificationToUser, sendNotificationToRole } = require('../config/socket');
const logger = require('../utils/logger');

// Get notifications for a user
exports.getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const { unreadOnly } = req.query;
    
    let query = { recipientId: userId };
    if (unreadOnly === 'true') {
      query.read = false;
    }
    
    const notifications = await Notification.find(query);
    
    res.json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    logger.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
      error: error.message
    });
  }
};

// Create and send notification
exports.createNotification = async (req, res) => {
  try {
    const notificationData = req.body;
    
    // Create notification in database
    const notification = await Notification.create(notificationData);
    
    // Send real-time notification via Socket.io
    sendNotificationToUser(notification.recipientId, notification);
    
    logger.info(`Notification created and sent to user ${notification.recipientId}`);
    
    res.status(201).json({
      success: true,
      data: notification
    });
  } catch (error) {
    logger.error('Error creating notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create notification',
      error: error.message
    });
  }
};

// Create notification for a role (e.g., all doctors)
exports.createRoleNotification = async (req, res) => {
  try {
    const { role, ...notificationData } = req.body;
    
    // Send real-time notification to all users with this role
    sendNotificationToRole(role, notificationData);
    
    logger.info(`Notification sent to all users with role ${role}`);
    
    res.status(201).json({
      success: true,
      message: `Notification sent to all ${role}s`
    });
  } catch (error) {
    logger.error('Error creating role notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create role notification',
      error: error.message
    });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    
    const notification = await Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    res.json({
      success: true,
      data: notification
    });
  } catch (error) {
    logger.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read',
      error: error.message
    });
  }
};

// Mark all notifications as read for a user
exports.markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.params;
    
    await Notification.updateMany(
      { recipientId: userId, read: false },
      { read: true }
    );
    
    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    logger.error('Error marking all notifications as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark all notifications as read',
      error: error.message
    });
  }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    
    const notification = await Notification.findByIdAndDelete(id);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Notification deleted'
    });
  } catch (error) {
    logger.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification',
      error: error.message
    });
  }
};

// Get unread count
exports.getUnreadCount = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const count = await Notification.countDocuments({
      recipientId: userId,
      read: false
    });
    
    res.json({
      success: true,
      count
    });
  } catch (error) {
    logger.error('Error getting unread count:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get unread count',
      error: error.message
    });
  }
};

// Helper function to create common notification types
exports.createAppointmentNotification = async (doctorId, patientId, patientName, type) => {
  const notificationData = {
    recipientId: doctorId,
    recipientRole: 'doctor',
    senderId: patientId,
    senderRole: 'patient',
    type: type,
    title: type === 'appointment_request' ? 'New Appointment Request' : 'Appointment Update',
    message: `${patientName} has ${type === 'appointment_request' ? 'requested' : 'updated'} an appointment`,
    icon: '📅',
    actionScreen: 'PatientRequests',
    priority: 'high'
  };
  
  const notification = await Notification.create(notificationData);
  sendNotificationToUser(doctorId, notification);
  
  return notification;
};

exports.createLabTestNotification = async (labId, patientId, patientName, testName) => {
  const notificationData = {
    recipientId: labId,
    recipientRole: 'lab',
    senderId: patientId,
    senderRole: 'patient',
    type: 'test_booking',
    title: 'New Test Booking',
    message: `${patientName} has booked ${testName}`,
    icon: '🧪',
    actionScreen: 'BookedTests',
    priority: 'high'
  };
  
  const notification = await Notification.create(notificationData);
  sendNotificationToUser(labId, notification);
  
  return notification;
};
