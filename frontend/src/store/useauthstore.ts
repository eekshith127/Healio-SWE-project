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

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  setUser: async (user) => {
    set({ user });
    if (user) {
      await AsyncStorage.setItem('user', JSON.stringify(user));
      
      // Notify users store that this user is now online
      // Import dynamically to avoid circular dependency
      import('./usersstore').then(({ useUsersStore }) => {
        useUsersStore.getState().markUserOnline(user.uid);
      });
    } else {
      await AsyncStorage.removeItem('user');
    }
  },
  logout: async () => {
    const currentUser = get().user;
    
    // Mark user as offline before logout
    if (currentUser) {
      import('./usersstore').then(({ useUsersStore }) => {
        useUsersStore.getState().markUserOffline(currentUser.uid);
      });
    }
    
    set({ user: null });
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('userToken');
  },
  loadUser: async () => {
    const storedUser = await AsyncStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      set({ user });
      
      // Mark user as online when loading from storage
      import('./usersstore').then(({ useUsersStore }) => {
        useUsersStore.getState().markUserOnline(user.uid);
      });
    }
  },
}));