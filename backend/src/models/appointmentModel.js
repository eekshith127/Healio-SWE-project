const { getFirestore } = require('../config/db');
const { FieldValue } = require('firebase-admin/firestore');

const COLLECTION_NAME = 'bookings';

const getBookingsCollection = () => {
  const db = getFirestore();
  return db.collection(COLLECTION_NAME);
};

const Booking = {
  async create(bookingData) {
    const collection = getBookingsCollection();
    const timestamp = FieldValue.serverTimestamp();
    
    const newBooking = {
      patient: bookingData.patient,
      doctor: bookingData.doctor,
      datetime: bookingData.datetime,
      status: bookingData.status || 'Pending',
      notes: bookingData.notes || '',
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    
    const docRef = await collection.add(newBooking);
    return { _id: docRef.id, ...newBooking };
  },

  async find(query = {}) {
    try {
      const collection = getBookingsCollection();
      let queryRef = collection;
      
      if (query.patient) {
        queryRef = queryRef.where('patient', '==', query.patient);
      }
      if (query.doctor) {
        queryRef = queryRef.where('doctor', '==', query.doctor);
      }
      if (query.status) {
        queryRef = queryRef.where('status', '==', query.status);
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
    const collection = getBookingsCollection();
    const doc = await collection.doc(id).get();
    
    if (!doc.exists) return null;
    
    return { _id: doc.id, ...doc.data() };
  },

  async findByIdAndUpdate(id, updates, options = {}) {
    const collection = getBookingsCollection();
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
    const collection = getBookingsCollection();
    const docRef = collection.doc(id);
    
    const doc = await docRef.get();
    if (!doc.exists) return null;
    
    const bookingData = { _id: doc.id, ...doc.data() };
    await docRef.delete();
    
    return bookingData;
  },
};

module.exports = Booking;