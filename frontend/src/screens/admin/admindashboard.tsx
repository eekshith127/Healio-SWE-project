import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { globalStyles } from '../../styles/globalstyle';
import { colors } from '../../styles/colors';
import { useAuthStore } from '../../store/useauthstore';
import { useNotificationStore } from '../../store/notificationstore';
import NotificationBadge from '../../components/notificationbadge';
import { useUsersStore } from '../../store/usersstore';

interface UserStats {
  totalUsers: number;
  patients: number;
  doctors: number;
  labs: number;
  admins: number;
  activeToday: number;
  activeUsers: number;
  onlineNow: number;
}

const AdminDashboard: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const { loadNotifications } = useNotificationStore();
  const { stats, loadStats: loadStatsFromStore } = useUsersStore();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadStats = async () => {
    try {
      await loadStatsFromStore();
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadStats();
    if (user?.uid) {
      loadNotifications(user.uid);
    }
    // Auto-refresh every 30 seconds for real-time updates
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, [user?.uid]);

  const onRefresh = () => {
    setRefreshing(true);
    loadStats();
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 10, color: colors.secondary }}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh}
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
      }
    >
      {/* Header with Gradient */}
      <LinearGradient
        colors={[colors.primary, '#ff6b9d']}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Admin Dashboard</Text>
            <Text style={styles.headerSubtitle}>Real-time System Overview</Text>
            {typeof stats?.onlineNow === 'number' && (
              <Text style={styles.onlineSubtitle}>{stats.onlineNow} users online now</Text>
            )}
          </View>
          <NotificationBadge />
        </View>
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>Live</Text>
        </View>
      </LinearGradient>

      {/* Real-time Statistics */}
      <View style={styles.statsContainer}>
        <View style={styles.statsGrid}>
          <TouchableOpacity style={[styles.statCard, { backgroundColor: colors.primary + '15' }]}>
            <LinearGradient
              colors={[colors.primary, '#ff6b9d']}
              style={styles.statIconGradient}
            >
              <Text style={styles.statIcon}>👥</Text>
            </LinearGradient>
            <Text style={styles.statNumber}>{stats?.totalUsers || 0}</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.statCard, { backgroundColor: '#28a74520' }]}>
            <LinearGradient
              colors={['#28a745', '#20c997']}
              style={styles.statIconGradient}
            >
              <Text style={styles.statIcon}>✅</Text>
            </LinearGradient>
            <Text style={[styles.statNumber, { color: '#28a745' }]}>{stats?.activeToday || 0}</Text>
            <Text style={styles.statLabel}>Active Today</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsGrid}>
          <TouchableOpacity style={[styles.statCard, { backgroundColor: '#6366f120' }]}>
            <LinearGradient
              colors={['#6366f1', '#8b5cf6']}
              style={styles.statIconGradient}
            >
              <Text style={styles.statIcon}>👨‍⚕️</Text>
            </LinearGradient>
            <Text style={[styles.statNumber, { color: '#6366f1' }]}>{stats?.doctors || 0}</Text>
            <Text style={styles.statLabel}>Doctors</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.statCard, { backgroundColor: '#e74bcd20' }]}>
            <LinearGradient
              colors={[colors.primary, '#ff6b9d']}
              style={styles.statIconGradient}
            >
              <Text style={styles.statIcon}>🧑‍⚕️</Text>
            </LinearGradient>
            <Text style={[styles.statNumber, { color: colors.primary }]}>{stats?.patients || 0}</Text>
            <Text style={styles.statLabel}>Patients</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsGrid}>
          <TouchableOpacity style={[styles.statCard, { backgroundColor: '#10b98120' }]}>
            <LinearGradient
              colors={['#10b981', '#14b8a6']}
              style={styles.statIconGradient}
            >
              <Text style={styles.statIcon}>🔬</Text>
            </LinearGradient>
            <Text style={[styles.statNumber, { color: '#10b981' }]}>{stats?.labs || 0}</Text>
            <Text style={styles.statLabel}>Laboratories</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.statCard, { backgroundColor: '#f59e0b20' }]}>
            <LinearGradient
              colors={['#f59e0b', '#ef4444']}
              style={styles.statIconGradient}
            >
              <Text style={styles.statIcon}>⚙️</Text>
            </LinearGradient>
            <Text style={[styles.statNumber, { color: '#f59e0b' }]}>{stats?.admins || 0}</Text>
            <Text style={styles.statLabel}>Admins</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Management Actions */}
      <Text style={styles.sectionTitle}>Management</Text>

      <TouchableOpacity 
        style={styles.actionCard}
        onPress={() => navigation.navigate('ManageUsers' as never)}
      >
        <Text style={styles.actionIcon}>👥</Text>
        <View style={styles.actionInfo}>
          <Text style={styles.actionTitle}>Manage Users</Text>
          <Text style={styles.actionSubtitle}>View, edit, and delete users</Text>
        </View>
        <Text style={styles.actionArrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.actionCard}
        onPress={() => navigation.navigate('ManageDoctors' as never)}
      >
        <Text style={styles.actionIcon}>🩺</Text>
        <View style={styles.actionInfo}>
          <Text style={styles.actionTitle}>Manage Doctors</Text>
          <Text style={styles.actionSubtitle}>Add, edit, and remove doctors</Text>
        </View>
        <Text style={styles.actionArrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.actionCard}
        onPress={() => navigation.navigate('Analytics' as never)}
      >
        <Text style={styles.actionIcon}>📊</Text>
        <View style={styles.actionInfo}>
          <Text style={styles.actionTitle}>Analytics</Text>
          <Text style={styles.actionSubtitle}>View system statistics</Text>
        </View>
        <Text style={styles.actionArrow}>›</Text>
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
    paddingBottom: 20,
  },
  header: {
    padding: 20,
    paddingTop: 30,
    paddingBottom: 30,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.9,
  },
  onlineSubtitle: {
    fontSize: 12,
    color: colors.white,
    opacity: 0.9,
    marginTop: 4,
  },
  liveBadge: {
    position: 'absolute',
    top: 30,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#28a745',
    marginRight: 6,
  },
  liveText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  statsContainer: {
    paddingHorizontal: 15,
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
    borderRadius: 18,
    padding: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  statIconGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statIcon: {
    fontSize: 24,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text,
    textAlign: 'center',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: 25,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
  actionIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  actionInfo: {
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

export default AdminDashboard;