import { io, Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { API_BASE_URL } from '../utils/constants';

// Use the same base URL as API calls for consistency
const SOCKET_URL = API_BASE_URL;

class SocketService {
  private socket: Socket | null = null;
  private userId: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private isConnecting = false;

  connect(userId: string, role: string) {
    // Don't attempt connection if already connecting or connected
    if (this.isConnecting || this.socket?.connected) {
      console.log('Socket already connected or connecting');
      return;
    }

    this.isConnecting = true;
    this.userId = userId;

    try {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: 2000,
        timeout: 10000,
      });

      this.socket.on('connect', () => {
        console.log('✅ Socket connected successfully:', this.socket?.id);
        this.reconnectAttempts = 0;
        this.isConnecting = false;
        
        // Join user's personal room
        if (this.userId) {
          this.socket?.emit('join', this.userId);
          this.socket?.emit('join_role', role);
          this.socket?.emit('user_online', this.userId);
        }
      });

      this.socket.on('connected', (data) => {
        console.log('✅ User connected to notification system:', data);
      });

      this.socket.on('disconnect', (reason) => {
        console.log('⚠️  Socket disconnected:', reason);
        this.isConnecting = false;
      });

      this.socket.on('connect_error', (error) => {
        this.reconnectAttempts++;
        this.isConnecting = false;
        
        // Only log detailed errors on first attempt
        if (this.reconnectAttempts === 1) {
          console.warn('⚠️  Socket connection failed. Backend may be offline. App will work in offline mode.');
          console.debug('Socket error details:', error.message);
        }
        
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          console.warn('ℹ️  Real-time notifications unavailable. Running in offline mode.');
          this.disconnect(); // Stop trying
        }
      });

      this.socket.on('error', (error) => {
        console.debug('Socket error:', error);
      });
    } catch (error) {
      console.warn('Failed to initialize Socket.io. Running in offline mode.');
      this.isConnecting = false;
    }
  }

  disconnect() {
    if (this.socket) {
      if (this.userId) {
        this.socket.emit('user_offline', this.userId);
      }
      this.socket.disconnect();
      this.socket = null;
      this.userId = null;
      console.log('Socket disconnected');
    }
  }

  onNotification(callback: (notification: any) => void) {
    this.socket?.on('notification', callback);
  }

  onUserStatus(callback: (data: { userId: string; status: string }) => void) {
    this.socket?.on('user_status', callback);
  }

  offNotification(callback: (notification: any) => void) {
    this.socket?.off('notification', callback);
  }

  offUserStatus(callback: (data: { userId: string; status: string }) => void) {
    this.socket?.off('user_status', callback);
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getSocketId(): string | undefined {
    return this.socket?.id;
  }
}

export default new SocketService();
