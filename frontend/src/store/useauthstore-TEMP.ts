// TEMPORARY: Auto-login for testing without Firebase
// Replace useauthstore.ts with this file temporarily

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  uid: string;
  email: string;
  role: 'patient' | 'doctor' | 'lab' | 'admin';
}

interface AuthStore {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  // TEMP: Auto-login as patient for testing
  user: {
    uid: 'test-123',
    email: 'test@example.com',
    role: 'patient'
  },
  setUser: async (user) => {
    set({ user });
    if (user) {
      await AsyncStorage.setItem('user', JSON.stringify(user));
    } else {
      await AsyncStorage.removeItem('user');
    }
  },
  logout: async () => {
    set({ user: null });
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('userToken');
  },
  loadUser: async () => {
    const storedUser = await AsyncStorage.getItem('user');
    if (storedUser) {
      set({ user: JSON.parse(storedUser) });
    }
  },
}));
