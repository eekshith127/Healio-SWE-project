const { Server } = require('socket.io');
const logger = require('../utils/logger');

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*', // In production, specify your frontend URL
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    // User joins their personal room
    socket.on('join', (userId) => {
      socket.join(`user:${userId}`);
      logger.info(`User ${userId} joined room user:${userId}`);
      
      // Notify user they're connected
      socket.emit('connected', { userId, socketId: socket.id });
    });

    // User joins a role-based room (e.g., all doctors)
    socket.on('join_role', (role) => {
      socket.join(`role:${role}`);
      logger.info(`Socket ${socket.id} joined role room: ${role}`);
    });

    // Mark user as online
    socket.on('user_online', (userId) => {
      io.emit('user_status', { userId, status: 'online' });
      logger.info(`User ${userId} is now online`);
    });

    // Mark user as offline
    socket.on('user_offline', (userId) => {
      io.emit('user_status', { userId, status: 'offline' });
      logger.info(`User ${userId} is now offline`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized! Call initializeSocket first.');
  }
  return io;
};

// Notification helpers
const sendNotificationToUser = (userId, notification) => {
  if (io) {
    io.to(`user:${userId}`).emit('notification', notification);
    logger.info(`Notification sent to user ${userId}`);
  }
};

const sendNotificationToRole = (role, notification) => {
  if (io) {
    io.to(`role:${role}`).emit('notification', notification);
    logger.info(`Notification sent to role ${role}`);
  }
};

const broadcastNotification = (notification) => {
  if (io) {
    io.emit('notification', notification);
    logger.info('Notification broadcasted to all users');
  }
};

module.exports = {
  initializeSocket,
  getIO,
  sendNotificationToUser,
  sendNotificationToRole,
  broadcastNotification
};
