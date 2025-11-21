import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { globalStyles } from '../../styles/globalstyle';
import { colors } from '../../styles/colors';
import { useAuthStore } from '../../store/useauthstore';
import { useNotificationStore } from '../../store/notificationstore';
import NotificationBadge from '../../components/notificationbadge';
import { fetchMyAppointments } from '../../api/bookingApi';

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const { notifications, unreadCount, loadNotifications } = useNotificationStore();

  const [stats, setStats] = useState({
    appointments: 0,
    pending: 0,
    completed: 0,
    patients: 0,
  });
  const [refreshing, setRefreshing] = useState(false);

  const loadStats = async () => {
    try {
      const appointments = await fetchMyAppointments();
      const total = appointments.length;

      let pending = 0;
      let confirmed = 0;
      const patientIds = new Set<string>();

      appointments.forEach((appt: any) => {
        const rawStatus = appt.status || 'Pending';
        const normalized = typeof rawStatus === 'string'
          ? rawStatus.toLowerCase()
          : String(rawStatus).toLowerCase();

        if (normalized === 'pending') {
          pending += 1;
        } else if (normalized === 'confirmed') {
          confirmed += 1;
        }

        if (appt.patient) {
          patientIds.add(String(appt.patient));
        }
      });

      setStats({
        appointments: total,
        pending,
        completed: confirmed,
        patients: patientIds.size,
      });
    } catch (error) {
      console.debug('Failed to load doctor stats', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Load notifications and stats on mount
  useEffect(() => {
    if (!user?.uid) return;
    loadNotifications(user.uid);
    loadStats();

    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, [user?.uid]);

  const onRefresh = () => {
    setRefreshing(true);
    loadStats();
  };

  // Get recent notifications (last 3)
  const recentNotifications = notifications.slice(0, 3);

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
          <Text style={globalStyles.title}>Welcome, Dr. {user?.email?.split('@')[0]}</Text>
          <Text style={styles.subtitle}>Dashboard Overview</Text>
        </View>
        <NotificationBadge />
      </View>

      {/* Statistics Cards */}
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: colors.primary + '15' }]}>
          <Text style={styles.statNumber}>{stats.appointments}</Text>
          <Text style={styles.statLabel}>Today's Appointments</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#FFA50020' }]}>
          <Text style={[styles.statNumber, { color: '#FFA500' }]}>{stats.pending}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: '#28a74520' }]}>
          <Text style={[styles.statNumber, { color: colors.success }]}>{stats.completed}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#6c757d20' }]}>
          <Text style={[styles.statNumber, { color: '#6c757d' }]}>{stats.patients}</Text>
          <Text style={styles.statLabel}>Total Patients</Text>
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
                onPress={() => navigation.navigate('PatientRequests' as never)}
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

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      
      <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => navigation.navigate('PatientRequests' as never)}
      >
        <View style={styles.actionContent}>
          <Text style={styles.actionIcon}>📄</Text>
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionTitle}>Patient Requests</Text>
            <Text style={styles.actionSubtitle}>View and manage appointment requests</Text>
          </View>
          <Text style={styles.actionArrow}>›</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => Alert.alert('Coming Soon', 'This feature will be available soon')}
      >
        <View style={styles.actionContent}>
          <Text style={styles.actionIcon}>📋</Text>
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionTitle}>Patient History</Text>
            <Text style={styles.actionSubtitle}>View patient medical records</Text>
          </View>
          <Text style={styles.actionArrow}>›</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => Alert.alert('Coming Soon', 'This feature will be available soon')}
      >
        <View style={styles.actionContent}>
          <Text style={styles.actionIcon}>📝</Text>
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionTitle}>Write Prescription</Text>
            <Text style={styles.actionSubtitle}>Create new prescription</Text>
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
    padding: 20,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 13,
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
});

export default DashboardScreen;