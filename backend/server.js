require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const morgan = require('morgan');
const { initializeFirestore } = require('./src/config/db');
const { initializeFirebase } = require('./src/config/firebaseAdmin');
const { initializeSocket } = require('./src/config/socket');
const errorHandler = require('./src/middleware/errorHandler');
const logger = require('./src/utils/logger');


// Routes
const userRoutes = require('./src/routes/userRoutes');
const bookingRoutes = require('./src/routes/bookingRoutes');
const chatbotRoutes = require('./src/routes/chatbotRoutes');
const medicineRoutes = require('./src/routes/medicineRoutes');
const systemRoutes = require('./src/routes/systemRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');


const app = express();
const server = http.createServer(app);


// Initialize Firebase and Firestore
initializeFirebase();
initializeFirestore();

// Initialize Socket.io
initializeSocket(server);


// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));


// mount routes
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/system', systemRoutes);
app.use('/api/notifications', notificationRoutes);


// error handler
app.use(errorHandler);


const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || '0.0.0.0'; // Bind to all network interfaces

if (require.main === module) {
  server.listen(PORT, HOST, () => {
    logger.info(`Healio backend listening on ${HOST}:${PORT}`);
    logger.info('Socket.io initialized and ready for real-time communication');
  });
}

module.exports = app;