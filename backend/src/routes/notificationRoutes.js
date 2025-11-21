const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Get notifications for a user
router.get('/user/:userId', notificationController.getNotifications);

// Get unread count
router.get('/user/:userId/unread-count', notificationController.getUnreadCount);

// Create notification
router.post('/', notificationController.createNotification);

// Create role notification
router.post('/role', notificationController.createRoleNotification);

// Mark notification as read
router.patch('/:id/read', notificationController.markAsRead);

// Mark all notifications as read for a user
router.patch('/user/:userId/read-all', notificationController.markAllAsRead);

// Delete notification
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;
