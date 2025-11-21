import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Animated, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { useAuthStore } from '../store/useauthstore';
import { colors } from '../styles/colors';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface MenuBarProps {
  visible: boolean;
  onClose: () => void;
}

const MenuBar: React.FC<MenuBarProps> = ({ visible, onClose }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { user, logout } = useAuthStore();
  const [slideAnim] = useState(new Animated.Value(-width));

  React.useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : -width,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const handleNavigate = (screen: keyof RootStackParamList) => {
    onClose();
    setTimeout(() => {
      navigation.navigate(screen as never);
    }, 300);
  };

  const handleLogout = async () => {
    onClose();
    await logout();
    // Auth navigation handled by RootNavigator
  };

  // Role-based menu items
  const getMenuItems = (): Array<{ icon: string; label: string; screen: keyof RootStackParamList }> => {
    const commonItems: Array<{ icon: string; label: string; screen: keyof RootStackParamList }> = [
      { icon: '💬', label: 'Support', screen: 'ChatBot' as const },
    ];

    const roleItems = {
      patient: [
        { icon: '🏠', label: 'Home', screen: 'Home' as const },
        { icon: '🩺', label: 'Find Doctors', screen: 'Doctors' as const },
        { icon: '💊', label: 'Medicines', screen: 'MedicineSearch' as const },
        { icon: '🧪', label: 'Lab Tests', screen: 'LabTests' as const },
        { icon: '📅', label: 'Appointments', screen: 'Appointments' as const },
        { icon: '🔔', label: 'Notifications', screen: 'Notifications' as const },
        { icon: '👤', label: 'Profile', screen: 'Profile' as const },
      ],
      doctor: [
        { icon: '📊', label: 'Dashboard', screen: 'Dashboard' as const },
        { icon: '📄', label: 'Patient Requests', screen: 'PatientRequests' as const },
      ],
      lab: [
        { icon: '🔬', label: 'Dashboard', screen: 'Dashboard' as const },
        { icon: '📋', label: 'Booked Tests', screen: 'BookedTests' as const },
      ],
      admin: [
        { icon: '⚙️', label: 'Dashboard', screen: 'AdminDashboard' as const },
        { icon: '👥', label: 'Manage Users', screen: 'ManageUsers' as const },
        { icon: '🩺', label: 'Manage Doctors', screen: 'ManageDoctors' as const },
        { icon: '📊', label: 'Analytics', screen: 'Analytics' as const },
      ],
    };

    const userRoleItems = roleItems[user?.role as keyof typeof roleItems] || [];
    return [...userRoleItems, ...commonItems];
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <Animated.View 
          style={[styles.menu, { transform: [{ translateX: slideAnim }] }]}
          onStartShouldSetResponder={() => true}
        >
          <LinearGradient
            colors={[colors.primary, '#ff6b9d']}
            style={styles.menuGradient}
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.profileIcon}>
                <Text style={styles.profileEmoji}>
                  {user?.role === 'patient' ? '👤' : 
                   user?.role === 'doctor' ? '👨‍⚕️' : 
                   user?.role === 'lab' ? '🔬' : '👨‍💼'}
                </Text>
              </View>
              <Text style={styles.userName}>{user?.email?.split('@')[0] || 'User'}</Text>
              <Text style={styles.userRole}>{user?.role?.toUpperCase()}</Text>
            </View>

            {/* Menu Items */}
            <View style={styles.menuItems}>
              {getMenuItems().map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.menuItem}
                  onPress={() => handleNavigate(item.screen)}
                >
                  <Text style={styles.menuIcon}>{item.icon}</Text>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <Text style={styles.menuArrow}>›</Text>
                </TouchableOpacity>
              ))}

              {/* Logout */}
              <TouchableOpacity
                style={[styles.menuItem, styles.logoutItem]}
                onPress={handleLogout}
              >
                <Text style={styles.menuIcon}>🚪</Text>
                <Text style={styles.menuLabel}>Logout</Text>
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Healio Health</Text>
              <Text style={styles.footerSubtext}>Version 1.0.0</Text>
            </View>
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menu: {
    width: width * 0.8,
    height: '100%',
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  menuGradient: {
    flex: 1,
  },
  header: {
    padding: 30,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  profileIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  profileEmoji: {
    fontSize: 40,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 5,
  },
  userRole: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  menuItems: {
    flex: 1,
    paddingVertical: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 25,
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    color: colors.white,
    fontWeight: '500',
  },
  menuArrow: {
    fontSize: 24,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  logoutItem: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 5,
  },
  footerSubtext: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
});

export default MenuBar;
