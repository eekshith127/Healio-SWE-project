import { create } from 'zustand';
import axios from 'axios';
import socketService from '../services/socketService';
import { API_BASE_URL } from '../utils/constants';

const API_URL = `${API_BASE_URL}/api`;

export interface Notification {
  _id?: string;
  id: string;
  recipientId: string;
  recipientRole: 'patient' | 'doctor' | 'lab' | 'admin';
  senderId: string;
  senderRole: 'patient' | 'doctor' | 'lab' | 'admin' | 'system';
  type: string;
  title: string;
  message: string;
  icon: string;
  read: boolean;
  actionScreen?: string;
  actionData?: any;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  timestamp?: string;
  createdAt?: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  
  // Actions
  loadNotifications: (userId: string) => Promise<void>;
  loadUnreadCount: (userId: string) => Promise<void>;
  addNotification: (notification: Notification) => void;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: (userId: string) => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  clearNotifications: () => void;
  
  // Real-time
  initializeRealtime: (userId: string, role: string) => void;
  cleanupRealtime: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,

  loadNotifications: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/notifications/user/${userId}`, {
        timeout: 5000
      });
      const notifications = response.data.data.map((n: any) => ({
        ...n,
        id: n._id,
        timestamp: n.createdAt
      }));
      
      set({ 
        notifications,
        unreadCount: notifications.filter((n: Notification) => !n.read).length,
        loading: false 
      });
    } catch (error: any) {
      // Silently fail if backend is offline - app will work without real-time notifications
      set({ 
        notifications: [],
        unreadCount: 0,
        loading: false,
        error: null // Don't show error if backend is offline
      });
      console.debug('Notifications unavailable - backend offline');
    }
  },

  loadUnreadCount: async (userId: string) => {
    try {
      const response = await axios.get(`${API_URL}/notifications/user/${userId}/unread-count`, {
        timeout: 5000
      });
      set({ unreadCount: response.data.count });
    } catch (error) {
      // Silently fail - not critical
      console.debug('Unread count unavailable - backend offline');
    }
  },

  addNotification: (notification: Notification) => {
    const notifications = [notification, ...get().notifications];
    const unreadCount = notifications.filter(n => !n.read).length;
    
    set({ notifications, unreadCount });
  },

  markAsRead: async (notificationId: string) => {
    try {
      await axios.patch(`${API_URL}/notifications/${notificationId}/read`);
      
      const notifications = get().notifications.map(n =>
        n.id === notificationId || n._id === notificationId ? { ...n, read: true } : n
      );
      const unreadCount = notifications.filter(n => !n.read).length;
      
      set({ notifications, unreadCount });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  },

  markAllAsRead: async (userId: string) => {
    try {
      await axios.patch(`${API_URL}/notifications/user/${userId}/read-all`);
      
      const notifications = get().notifications.map(n => ({ ...n, read: true }));
      
      set({ notifications, unreadCount: 0 });
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  },

  deleteNotification: async (notificationId: string) => {
    try {
      await axios.delete(`${API_URL}/notifications/${notificationId}`);
      
      const notifications = get().notifications.filter(
        n => n.id !== notificationId && n._id !== notificationId
      );
      const unreadCount = notifications.filter(n => !n.read).length;
      
      set({ notifications, unreadCount });
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  },

  clearNotifications: () => {
    set({ notifications: [], unreadCount: 0 });
  },

  // Real-time functionality
  initializeRealtime: (userId: string, role: string) => {
    // Connect to socket
    socketService.connect(userId, role);
    
    // Listen for new notifications
    const handleNotification = (notification: any) => {
      const formattedNotification: Notification = {
        ...notification,
        id: notification._id || notification.id,
        timestamp: notification.createdAt || new Date().toISOString()
      };
      
      get().addNotification(formattedNotification);
      
      // Show a local notification or toast here if needed
      console.log('New notification received:', formattedNotification);
    };
    
    socketService.onNotification(handleNotification);
    
    // Listen for real-time user status updates and update users store
    const handleUserStatus = (data: { userId: string; status: string }) => {
      import('./usersstore')
        .then(({ useUsersStore }) => {
          const { markUserOnline, markUserOffline } = useUsersStore.getState();
          if (data.status === 'online') {
            markUserOnline(data.userId);
          } else if (data.status === 'offline') {
            markUserOffline(data.userId);
          }
        })
        .catch(error => {
          console.debug('Failed to handle user status update:', error);
        });
    };

    socketService.onUserStatus(handleUserStatus);
    
    // Load initial notifications
    get().loadNotifications(userId);
    get().loadUnreadCount(userId);
  },

  cleanupRealtime: () => {
    socketService.disconnect();
  }
}));
