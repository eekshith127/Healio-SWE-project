const { admin } = require('./firebaseAdmin');
const logger = require('../utils/logger');

// Firestore instance
let db = null;

const initializeFirestore = () => {
  try {
    if (!admin.apps || admin.apps.length === 0) {
      throw new Error('Firebase Admin not initialized. Firestore unavailable.');
    }
    
    db = admin.firestore();
    
    // Optional: Set Firestore settings
    db.settings({
      ignoreUndefinedProperties: true,
    });
    
    logger.info('Firestore initialized successfully');
    return db;
  } catch (err) {
    logger.error('Firestore initialization error', err);
    throw err;
  }
};

const getFirestore = () => {
  if (!db) {
    throw new Error('Firestore not initialized. Call initializeFirestore() first.');
  }
  return db;
};

module.exports = { initializeFirestore, getFirestore };