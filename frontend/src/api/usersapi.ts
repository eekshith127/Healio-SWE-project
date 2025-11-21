import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../utils/constants';

// Create axios instance with auth interceptor
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.debug('No auth token found');
  }
  return config;
});

export interface BackendUser {
  _id: string;
  firebaseUid: string;
  email: string;
  name?: string;
  phone?: string;
  role: 'patient' | 'doctor' | 'lab' | 'admin';
  specialization?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Fetch all users from backend (Admin only)
 */
export const fetchAllUsers = async (): Promise<BackendUser[]> => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error: any) {
    if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
      console.debug('Backend unavailable - using offline mode');
      return [];
    }
    if (error.response?.status === 403) {
      console.debug('Access denied - admin role required');
      return [];
    }
    throw error;
  }
};

/**
 * Fetch single user by ID
 */
export const fetchUserById = async (id: string): Promise<BackendUser> => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

/**
 * Update user profile
 */
export const updateUserProfile = async (id: string, data: Partial<BackendUser>) => {
  const response = await api.put(`/users/${id}`, data);
  return response.data;
};

/**
 * Delete user (Admin only)
 */
export const deleteUserById = async (id: string) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

/**
 * Fetch user statistics (for dashboard)
 */
export const fetchUserStats = async () => {
  try {
    const users = await fetchAllUsers();
    
    const stats = {
      totalUsers: users.length,
      patients: users.filter(u => u.role === 'patient').length,
      doctors: users.filter(u => u.role === 'doctor').length,
      labs: users.filter(u => u.role === 'lab').length,
      admins: users.filter(u => u.role === 'admin').length,
      activeToday: users.length, // You can enhance this with real activity tracking
      activeUsers: users.length,
    };
    
    return stats;
  } catch (error) {
    console.debug('Stats unavailable - backend offline');
    return {
      totalUsers: 0,
      patients: 0,
      doctors: 0,
      labs: 0,
      admins: 0,
      activeToday: 0,
      activeUsers: 0,
    };
  }
};

/**
 * Fetch doctors from backend
 */
export const fetchDoctorsFromBackend = async () => {
  try {
    const response = await api.get('/users/doctors');
    return response.data;
  } catch (error: any) {
    if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
      console.debug('Doctors unavailable - backend offline');
      return [];
    }
    if (error.response?.status === 403) {
      console.debug('Access denied to doctors endpoint');
      return [];
    }
    console.debug('Doctors unavailable - backend offline');
    return [];
  }
};
