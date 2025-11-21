const { getFirestore } = require('../config/db');
const { FieldValue } = require('firebase-admin/firestore');

const COLLECTION_NAME = 'notifications';

const getNotificationsCollection = () => {
  const db = getFirestore();
  return db.collection(COLLECTION_NAME);
};

const Notification = {
  async create(notificationData) {
    const collection = getNotificationsCollection();
    const timestamp = FieldValue.serverTimestamp();
    
    const newNotification = {
      recipientId: notificationData.recipientId,
      recipientRole: notificationData.recipientRole,
      senderId: notificationData.senderId,
      senderRole: notificationData.senderRole,
      type: notificationData.type,
      title: notificationData.title,
      message: notificationData.message,
      icon: notificationData.icon || '🔔',
      read: notificationData.read || false,
      actionScreen: notificationData.actionScreen || null,
      actionData: notificationData.actionData || null,
      priority: notificationData.priority || 'normal',
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    
    const docRef = await collection.add(newNotification);
    return { _id: docRef.id, ...newNotification };
  },

  async find(query = {}) {
    try {
      const collection = getNotificationsCollection();
      let queryRef = collection;
      
      if (query.recipientId) {
        queryRef = queryRef.where('recipientId', '==', query.recipientId);
      }
      if (query.read !== undefined) {
        queryRef = queryRef.where('read', '==', query.read);
      }
      
      queryRef = queryRef.orderBy('createdAt', 'desc');
      
      const snapshot = await queryRef.get();
      
      if (snapshot.empty) return [];
      
      return snapshot.docs.map(doc => ({
        _id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      // Collection doesn't exist yet or is empty
      if (error.code === 5 || error.code === 'NOT_FOUND') {
        return [];
      }
      throw error;
    }
  },

  async findById(id) {
    const collection = getNotificationsCollection();
    const doc = await collection.doc(id).get();
    
    if (!doc.exists) return null;
    
    return { _id: doc.id, ...doc.data() };
  },

  async findByIdAndUpdate(id, updates, options = {}) {
    const collection = getNotificationsCollection();
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
    const collection = getNotificationsCollection();
    const docRef = collection.doc(id);
    
    const doc = await docRef.get();
    if (!doc.exists) return null;
    
    const notificationData = { _id: doc.id, ...doc.data() };
    await docRef.delete();
    
    return notificationData;
  },

  async deleteMany(query) {
    const docs = await this.find(query);
    const batch = getFirestore().batch();
    const collection = getNotificationsCollection();
    
    docs.forEach(doc => {
      batch.delete(collection.doc(doc._id));
    });
    
    await batch.commit();
    return { deletedCount: docs.length };
  },

  async countDocuments(query = {}) {
    try {
      const collection = getNotificationsCollection();
      let queryRef = collection;
      
      if (query.recipientId) {
        queryRef = queryRef.where('recipientId', '==', query.recipientId);
      }
      if (query.read !== undefined) {
        queryRef = queryRef.where('read', '==', query.read);
      }
      
      const snapshot = await queryRef.count().get();
      return snapshot.data().count;
    } catch (error) {
      // Collection doesn't exist yet or is empty
      if (error.code === 5 || error.code === 'NOT_FOUND') {
        return 0;
      }
      throw error;
    }
  },

  async updateMany(query, updates) {
    const docs = await this.find(query);
    const batch = getFirestore().batch();
    const collection = getNotificationsCollection();
    
    const updateData = {
      ...updates,
      updatedAt: FieldValue.serverTimestamp(),
    };
    
    docs.forEach(doc => {
      batch.update(collection.doc(doc._id), updateData);
    });
    
    await batch.commit();
    return { modifiedCount: docs.length };
  },
};

module.exports = Notification;
