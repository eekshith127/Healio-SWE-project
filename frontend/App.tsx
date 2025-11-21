import 'react-native-reanimated';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/rootnavigator';
import { useAuthStore } from './src/store/useauthstore';
import { useNotificationStore } from './src/store/notificationstore';

export default function App() {
  const { user, loadUser } = useAuthStore();
  const { initializeRealtime, cleanupRealtime } = useNotificationStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await loadUser();
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, [loadUser]);

  // Initialize real-time notifications when user is logged in
  useEffect(() => {
    if (user?.uid && user?.role) {
      console.log('Initializing real-time notifications for user:', user.uid);
      initializeRealtime(user.uid, user.role);
    }

    return () => {
      if (user) {
        cleanupRealtime();
      }
    };
  }, [user, initializeRealtime, cleanupRealtime]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <RootNavigator />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}