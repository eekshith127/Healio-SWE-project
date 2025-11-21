import { Platform } from 'react-native';

// In development: use localhost for iOS simulator and computer's IP for Android emulator
// In production: replace with your deployed backend URL
// If 10.0.2.2 doesn't work, use your computer's actual IP address (run ipconfig to find it)
const DEV_PORT = 4000;

const getDevBaseUrl = () => {
  return `http://10.173.253.188:${DEV_PORT}`;
};

export const API_BASE_URL = __DEV__
  ? getDevBaseUrl()
  : 'https://your-backend-url.com';

export const FIREBASE_CONFIG = {
  apiKey: 'your-api-key',
  authDomain: 'your-project.firebaseapp.com',
  // Add other Firebase config keys
};

export const ROLES = ['patient', 'doctor', 'lab', 'admin'] as const;
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB for uploads