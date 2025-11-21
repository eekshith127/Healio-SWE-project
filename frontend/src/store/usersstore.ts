import { create } from 'zustand';
import { fetchAllUsers, fetchUserStats, BackendUser } from '../api/usersapi';
import { fetchUsers as fetchMockUsers, getUserStats as getMockStats } from '../api/mockapi';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor' | 'lab' | 'admin';
  phone?: string;
  status: 'active' | 'inactive' | 'online';
  lastActive: string;
  age?: number;
  address?: string;
  specialty?: string;
  experience?: string;
  joinedDate?: string;
  isOnline?: boolean;
  lastLogin?: string;
}

export interface UserStats {
  totalUsers: number;
  patients: number;
  doctors: number;
  labs: number;
  admins: number;
  activeToday: number;
  activeUsers: number;
  onlineNow: number;
  recentLogins: User[];
}

interface UsersState {
  users: User[];
  stats: UserStats | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  onlineUsers: Set<string>;
  
  // Actions
  loadUsers: () => Promise<void>;
  loadStats: () => Promise<void>;
  addUser: (user: User) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  setUsers: (users: User[]) => void;
  
  // Real-time tracking
  markUserOnline: (userId: string) => Promise<void>;
  markUserOffline: (userId: string) => void;
  updateUserLastActive: (userId: string) => void;
  getRecentlyLoggedIn: () => User[];
}

export const useUsersStore = create<UsersState>((set, get) => ({
  users: [],
  stats: null,
  loading: false,
  error: null,
  lastUpdated: null,
  onlineUsers: new Set<string>(),

  loadUsers: async () => {
    set({ loading: true, error: null });
    try {
      // Check if current user is admin before trying to fetch all users
      const currentUserStr = await import('@react-native-async-storage/async-storage').then(
        AsyncStorage => AsyncStorage.default.getItem('user')
      );
      const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
      
      if (currentUser?.role === 'admin') {
        // Admin can fetch all users
        const backendUsers = await fetchAllUsers();
        
        if (backendUsers.length > 0) {
          // Transform backend users to frontend User format
          const usersWithStatus = backendUsers.map((user: BackendUser) => ({
            id: user.firebaseUid || user._id,
            name: user.name || user.email.split('@')[0],
            email: user.email,
            role: user.role,
            phone: user.phone,
            status: 'active' as const,
            lastActive: user.updatedAt || new Date().toISOString(),
            isOnline: false,
            specialty: user.specialization,
            joinedDate: user.createdAt,
          }));
          
          set({ 
            users: usersWithStatus, 
            loading: false, 
            lastUpdated: new Date() 
          });
          return;
        }
      }
      
      // For non-admin users or if no backend users, use mock data
      console.debug('Backend unavailable, using mock data');
      const mockData = await fetchMockUsers();
      const usersWithStatus = mockData.map((user: any) => ({
        ...user,
        isOnline: false,
        status: user.status || 'active',
      }));
      set({ 
        users: usersWithStatus, 
        loading: false, 
        lastUpdated: new Date() 
      });
    } catch (error) {
      // If backend is offline, fallback to mock data
      console.debug('Backend unavailable, using mock data');
      try {
        const mockData = await fetchMockUsers();
        const usersWithStatus = mockData.map((user: any) => ({
          ...user,
          isOnline: false,
          status: user.status || 'active',
        }));
        set({ 
          users: usersWithStatus, 
          loading: false, 
          lastUpdated: new Date() 
        });
      } catch (mockError) {
        set({ 
          error: 'Failed to load users', 
          loading: false 
        });
        console.error('Error loading users:', error);
      }
    }
  },

  loadStats: async () => {
    try {
      // Try real backend first
      const statsData = await fetchUserStats();
      const recentLogins = get().getRecentlyLoggedIn();
      set({ 
        stats: {
          ...statsData,
          onlineNow: get().onlineUsers.size,
          recentLogins,
        }
      });
    } catch (error) {
      // Fallback to mock stats
      console.debug('Stats unavailable, using mock data');
      try {
        const mockStats = await getMockStats();
        const recentLogins = get().getRecentlyLoggedIn();
        set({ 
          stats: {
            ...mockStats,
            onlineNow: get().onlineUsers.size,
            recentLogins,
          }
        });
      } catch (mockError) {
        console.error('Error loading stats:', error);
      }
    }
  },

  addUser: (user: User) => {
    const currentUsers = get().users;
    set({ 
      users: [...currentUsers, user],
      lastUpdated: new Date()
    });
  },

  updateUser: (id: string, updates: Partial<User>) => {
    const currentUsers = get().users;
    set({ 
      users: currentUsers.map(u => 
        u.id === id ? { ...u, ...updates } : u
      ),
      lastUpdated: new Date()
    });
  },

  deleteUser: (id: string) => {
    const currentUsers = get().users;
    const onlineUsers = new Set(get().onlineUsers);
    onlineUsers.delete(id);
    set({ 
      users: currentUsers.filter(u => u.id !== id),
      onlineUsers,
      lastUpdated: new Date()
    });
  },

  setUsers: (users: User[]) => {
    set({ 
      users,
      lastUpdated: new Date()
    });
  },

  // Real-time tracking
  markUserOnline: async (userId: string) => {
    let currentUsers = get().users;
    
    // Only load users if we're an admin and users list is empty
    if (currentUsers.length === 0) {
      // Check if current user is admin before loading users
      const currentUserStr = await import('@react-native-async-storage/async-storage').then(
        AsyncStorage => AsyncStorage.default.getItem('user')
      );
      const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
      
      if (currentUser?.role === 'admin') {
        await get().loadUsers();
        currentUsers = get().users;
      } else {
        // For non-admin users, just track online status without loading full user list
        console.debug(`User ${userId} marked online (no user list loaded for non-admin)`);
        const onlineUsers = new Set(get().onlineUsers);
        onlineUsers.add(userId);
        set({ onlineUsers });
        return;
      }
    }
    
    const userExists = currentUsers.some(u => u.id === userId);
    
    if (!userExists) {
      // User might be in Firebase Auth but not in users list yet
      // This is expected during initial login, so just log debug info
      console.debug(`User ${userId} not yet in users list, will be added when list loads`);
      return;
    }
    
    const onlineUsers = new Set(get().onlineUsers);
    onlineUsers.add(userId);
    
    set({ 
      users: currentUsers.map(u => 
        u.id === userId 
          ? { 
              ...u, 
              isOnline: true, 
              status: 'online' as const,
              lastLogin: new Date().toISOString(),
              lastActive: new Date().toISOString()
            } 
          : u
      ),
      onlineUsers,
      lastUpdated: new Date()
    });
  },

  markUserOffline: (userId: string) => {
    const currentUsers = get().users;
    const onlineUsers = new Set(get().onlineUsers);
    onlineUsers.delete(userId);
    
    set({ 
      users: currentUsers.map(u => 
        u.id === userId 
          ? { 
              ...u, 
              isOnline: false, 
              status: 'active' as const,
              lastActive: new Date().toISOString()
            } 
          : u
      ),
      onlineUsers,
      lastUpdated: new Date()
    });
  },

  updateUserLastActive: (userId: string) => {
    const currentUsers = get().users;
    set({ 
      users: currentUsers.map(u => 
        u.id === userId 
          ? { ...u, lastActive: new Date().toISOString() } 
          : u
      ),
      lastUpdated: new Date()
    });
  },

  getRecentlyLoggedIn: () => {
    const users = get().users;
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    
    return users
      .filter(u => {
        if (!u.lastLogin) return false;
        const loginTime = new Date(u.lastLogin);
        return loginTime >= fiveMinutesAgo;
      })
      .sort((a, b) => {
        const timeA = new Date(a.lastLogin || 0).getTime();
        const timeB = new Date(b.lastLogin || 0).getTime();
        return timeB - timeA;
      })
      .slice(0, 10); // Top 10 recent logins
  },
}));
