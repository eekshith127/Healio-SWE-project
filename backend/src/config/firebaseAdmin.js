const admin = require('firebase-admin');
const logger = require('../utils/logger');

function initializeFirebase() {
  const {
    FIREBASE_PROJECT_ID,
    FIREBASE_PRIVATE_KEY_ID,
    FIREBASE_PRIVATE_KEY,
    FIREBASE_CLIENT_EMAIL,
    FIREBASE_CLIENT_ID
  } = process.env;

  // If any required variable is missing, skip initialization
  if (!FIREBASE_PROJECT_ID || !FIREBASE_PRIVATE_KEY || !FIREBASE_CLIENT_EMAIL) {
    logger.warn('Firebase env variables not provided; Firebase Admin will not initialize.');
    return;
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        project_id: FIREBASE_PROJECT_ID,
        private_key_id: FIREBASE_PRIVATE_KEY_ID,
        private_key: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        client_email: FIREBASE_CLIENT_EMAIL,
        client_id: FIREBASE_CLIENT_ID,
      }),
    });

    logger.info(`Firebase Admin initialized for project ${FIREBASE_PROJECT_ID}`);
  } catch (err) {
    logger.error('Failed to initialize Firebase Admin:', err);
    // You can choose to crash here:
    // process.exit(1);
  }
}

module.exports = { admin, initializeFirebase };
