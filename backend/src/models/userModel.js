const { getFirestore } = require('../config/db');
const { FieldValue } = require('firebase-admin/firestore');

const COLLECTION_NAME = 'users';

// Helper to get users collection
const getUsersCollection = () => {
  const db = getFirestore();
  return db.collection(COLLECTION_NAME);
};

// User model helper functions
const User = {
  // Create a new user
  async create(userData) {
    try {
      console.log('Creating user with data:', userData);
      const collection = getUsersCollection();
      const timestamp = FieldValue.serverTimestamp();
      
      const newUser = {
        ...userData,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      
      console.log('Adding user to Firestore collection...');
      const docRef = await collection.add(newUser);
      console.log('User created successfully with ID:', docRef.id);
      return { _id: docRef.id, ...newUser };
    } catch (error) {
      console.error('Error creating user:', error.message);
      console.error('Error code:', error.code);
      console.error('Full error:', error);
      throw error;
    }
  },

  // Find user by firebaseUid
  async findOne(query) {
    try {
      const collection = getUsersCollection();
      
      if (query.firebaseUid) {
        const snapshot = await collection
          .where('firebaseUid', '==', query.firebaseUid)
          .limit(1)
          .get();
        
        if (snapshot.empty) return null;
        
        const doc = snapshot.docs[0];
        return { _id: doc.id, ...doc.data() };
      }
      
      return null;
    } catch (error) {
      // Collection doesn't exist yet
      if (error.code === 5 || error.code === 'NOT_FOUND') {
        return null;
      }
      throw error;
    }
  },

  // Find user by ID
  async findById(id, projection = null) {
    const collection = getUsersCollection();
    const doc = await collection.doc(id).get();
    
    if (!doc.exists) return null;
    
    return { _id: doc.id, ...doc.data() };
  },

  // Find all users
  async find(query = {}, projection = null) {
    try {
      const collection = getUsersCollection();
      let queryRef = collection;
      
      // Apply filters if any
      if (query.role) {
        queryRef = queryRef.where('role', '==', query.role);
      }
      
      const snapshot = await queryRef.get();
      
      if (snapshot.empty) return [];
      
      return snapshot.docs.map(doc => ({
        _id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      // Collection doesn't exist yet
      if (error.code === 5 || error.code === 'NOT_FOUND') {
        return [];
      }
      throw error;
    }
  },

  // Update user by ID
  async findByIdAndUpdate(id, updates, options = {}) {
    const collection = getUsersCollection();
    const docRef = collection.doc(id);
    
    const updateData = {
      ...updates,
      updatedAt: FieldValue.serverTimestamp(),
    };
    
    await docRef.update(updateData);
    
    if (options.new) {
      const doc = await docRef.get();
      return doc.exists ? { _id: doc.id, ...doc.data() } : null;
    }
    
    return { _id: id, ...updates };
  },

  // Delete user by ID
  async findByIdAndDelete(id) {
    const collection = getUsersCollection();
    const docRef = collection.doc(id);
    
    const doc = await docRef.get();
    if (!doc.exists) return null;
    
    const userData = { _id: doc.id, ...doc.data() };
    await docRef.delete();
    
    return userData;
  },

  // Save method for instances
  async save(userData) {
    if (userData._id) {
      // Update existing
      return this.findByIdAndUpdate(userData._id, userData, { new: true });
    } else {
      // Create new
      return this.create(userData);
    }
  },
};

module.exports = User;