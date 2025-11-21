const { getFirestore } = require('../config/db');
const { FieldValue } = require('firebase-admin/firestore');

const COLLECTION_NAME = 'medicines';

const getMedicinesCollection = () => {
  const db = getFirestore();
  return db.collection(COLLECTION_NAME);
};

const Medicine = {
  async create(medicineData) {
    const collection = getMedicinesCollection();
    const timestamp = FieldValue.serverTimestamp();
    
    const newMedicine = {
      ...medicineData,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    
    const docRef = await collection.add(newMedicine);
    return { _id: docRef.id, ...medicineData };
  },

  async find(query = {}) {
    try {
      const collection = getMedicinesCollection();
      let queryRef = collection;
      
      // Apply filters if any
      if (query.name) {
        queryRef = queryRef.where('name', '==', query.name);
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

  async findById(id) {
    const collection = getMedicinesCollection();
    const doc = await collection.doc(id).get();
    
    if (!doc.exists) return null;
    
    return { _id: doc.id, ...doc.data() };
  },

  async findByIdAndUpdate(id, updates, options = {}) {
    const collection = getMedicinesCollection();
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

  async findByIdAndDelete(id) {
    const collection = getMedicinesCollection();
    const docRef = collection.doc(id);
    
    const doc = await docRef.get();
    if (!doc.exists) return null;
    
    const medicineData = { _id: doc.id, ...doc.data() };
    await docRef.delete();
    
    return medicineData;
  },
};

module.exports = Medicine;