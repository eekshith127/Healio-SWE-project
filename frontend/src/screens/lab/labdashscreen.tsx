import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { globalStyles } from '../../styles/globalstyle';
import { colors } from '../../styles/colors';
import { useAuthStore } from '../../store/useauthstore';
import { useNotificationStore } from '../../store/notificationstore';
import NotificationBadge from '../../components/notificationbadge';

const LabDashboardScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const { notifications, loadNotifications, unreadCount } = useNotificationStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      loadNotifications(user.uid);
    }
  }, [user?.uid]);

  const onRefresh = () => {
    if (!user?.uid) return;
    setRefreshing(true);
    Promise.resolve(loadNotifications(user.uid))
      .finally(() => setRefreshing(false));
  };

  const recentNotifications = notifications.slice(0, 3);

  const totalBookings = notifications.filter(n => n.type === 'test_booking').length;

  const bookingsToday = notifications.filter(n => {
    if (n.type !== 'test_booking') return false;
    const timestamp = (n as any).timestamp || (n as any).createdAt;
    if (!timestamp) return false;
    const date = new Date(timestamp);
    const today = new Date();
    return date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate();
  }).length;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <View>
          <Text style={globalStyles.title}>Lab Dashboard</Text>
          <Text style={styles.subtitle}>Manage your lab tests</Text>
        </View>
        <NotificationBadge />
      </View>

      {/* Real-time Lab Analytics */}
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: colors.primary + '15' }]}>
          <Text style={styles.statNumber}>{bookingsToday}</Text>
          <Text style={styles.statLabel}>New Bookings Today</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#10b98120' }]}>
          <Text style={[styles.statNumber, { color: '#10b981' }]}>{totalBookings}</Text>
          <Text style={styles.statLabel}>Total Bookings</Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: '#f59e0b20' }]}>
          <Text style={[styles.statNumber, { color: '#f59e0b' }]}>{unreadCount}</Text>
          <Text style={styles.statLabel}>Unread Notifications</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#6366f120' }]}>
          <Text style={[styles.statNumber, { color: '#6366f1' }]}>{recentNotifications.length}</Text>
          <Text style={styles.statLabel}>Recent Alerts</Text>
        </View>
      </View>

      {/* Recent Notifications */}
      {recentNotifications.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Recent Notifications</Text>
          <View style={styles.notificationsContainer}>
            {recentNotifications.map((notification) => (
              <TouchableOpacity
                key={notification.id || notification._id}
                style={[
                  styles.notificationCard,
                  !notification.read && styles.unreadNotification
                ]}
                onPress={() => navigation.navigate('BookedTests' as never)}
              >
                <Text style={styles.notificationIcon}>{notification.icon}</Text>
                <View style={styles.notificationContent}>
                  <Text style={styles.notificationTitle}>{notification.title}</Text>
                  <Text style={styles.notificationMessage} numberOfLines={1}>
                    {notification.message}
                  </Text>
                </View>
                {!notification.read && <View style={styles.unreadDot} />}
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => navigation.navigate('BookedTests' as never)}
      >
        <View style={styles.actionContent}>
          <Text style={styles.actionIcon}>🧪</Text>
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionTitle}>View Booked Tests</Text>
            <Text style={styles.actionSubtitle}>Manage all test bookings</Text>
          </View>
          <Text style={styles.actionArrow}>›</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.secondary,
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: 25,
    marginBottom: 15,
  },
  notificationsContainer: {
    marginBottom: 20,
  },
  notificationCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  unreadNotification: {
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    backgroundColor: '#fffbfe',
  },
  notificationIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  notificationMessage: {
    fontSize: 12,
    color: colors.secondary,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: 8,
  },
  actionButton: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 3,
  },
  actionSubtitle: {
    fontSize: 13,
    color: colors.secondary,
  },
  actionArrow: {
    fontSize: 24,
    color: colors.secondary,
  },
});

export default LabDashboardScreen;