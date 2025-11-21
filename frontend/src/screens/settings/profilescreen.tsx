import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, TextInput, Switch, StyleSheet, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../store/useauthstore';
import { globalStyles } from '../../styles/globalstyle';
import { colors } from '../../styles/colors';

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuthStore();
  
  // Edit Profile Modal
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.email?.split('@')[0] || 'User',
    phone: '+1 234 567 8900',
    bio: 'Healthcare professional',
  });
  
  // Password Modal
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  
  // Settings
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            navigation.navigate('Auth' as never);
          },
        },
      ]
    );
  };
  
  const handleSaveProfile = () => {
    Alert.alert('Success', 'Profile updated successfully');
    setEditModalVisible(false);
  };
  
  const handleChangePassword = () => {
    if (!passwordData.current || !passwordData.new || !passwordData.confirm) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    if (passwordData.new !== passwordData.confirm) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }
    if (passwordData.new.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    Alert.alert('Success', 'Password changed successfully');
    setPasswordModalVisible(false);
    setPasswordData({ current: '', new: '', confirm: '' });
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <Text style={globalStyles.title}>Profile & Settings</Text>
        
        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name</Text>
              <Text style={styles.infoValue}>{profileData.name}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user?.email}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Role</Text>
              <Text style={[styles.infoValue, styles.roleText]}>{user?.role?.toUpperCase()}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{profileData.phone}</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => setEditModalVisible(true)}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => setPasswordModalVisible(true)}
          >
            <Text style={styles.settingText}>Change Password</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>Privacy Settings</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.settingItem}>
            <Text style={styles.settingText}>Push Notifications</Text>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#ccc', true: colors.primary }}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.settingItem}>
            <Text style={styles.settingText}>Email Notifications</Text>
            <Switch
              value={emailNotifications}
              onValueChange={setEmailNotifications}
              trackColor={{ false: '#ccc', true: colors.primary }}
            />
          </View>
        </View>

        {/* Appearance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <View style={styles.settingItem}>
            <Text style={styles.settingText}>Dark Mode</Text>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#ccc', true: colors.primary }}
            />
          </View>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>Help Center</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>Terms of Service</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>Privacy Policy</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.settingItem}>
            <Text style={styles.settingText}>App Version</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={[globalStyles.button, { backgroundColor: colors.error, marginTop: 20, marginBottom: 40 }]} 
          onPress={handleLogout}
        >
          <Text style={globalStyles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal visible={editModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={globalStyles.title}>Edit Profile</Text>
            
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={globalStyles.textInput}
              value={profileData.name}
              onChangeText={(text) => setProfileData({ ...profileData, name: text })}
              placeholder="Enter your name"
            />
            
            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={globalStyles.textInput}
              value={profileData.phone}
              onChangeText={(text) => setProfileData({ ...profileData, phone: text })}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
            />
            
            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={[globalStyles.textInput, { height: 80 }]}
              value={profileData.bio}
              onChangeText={(text) => setProfileData({ ...profileData, bio: text })}
              placeholder="Tell us about yourself"
              multiline
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[globalStyles.button, { flex: 1, backgroundColor: colors.secondary, marginRight: 10 }]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={globalStyles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[globalStyles.button, { flex: 1 }]}
                onPress={handleSaveProfile}
              >
                <Text style={globalStyles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Change Password Modal */}
      <Modal visible={passwordModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={globalStyles.title}>Change Password</Text>
            
            <Text style={styles.label}>Current Password</Text>
            <TextInput
              style={globalStyles.textInput}
              value={passwordData.current}
              onChangeText={(text) => setPasswordData({ ...passwordData, current: text })}
              placeholder="Enter current password"
              secureTextEntry
            />
            
            <Text style={styles.label}>New Password</Text>
            <TextInput
              style={globalStyles.textInput}
              value={passwordData.new}
              onChangeText={(text) => setPasswordData({ ...passwordData, new: text })}
              placeholder="Enter new password"
              secureTextEntry
            />
            
            <Text style={styles.label}>Confirm New Password</Text>
            <TextInput
              style={globalStyles.textInput}
              value={passwordData.confirm}
              onChangeText={(text) => setPasswordData({ ...passwordData, confirm: text })}
              placeholder="Confirm new password"
              secureTextEntry
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[globalStyles.button, { flex: 1, backgroundColor: colors.secondary, marginRight: 10 }]}
                onPress={() => setPasswordModalVisible(false)}
              >
                <Text style={globalStyles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[globalStyles.button, { flex: 1 }]}
                onPress={handleChangePassword}
              >
                <Text style={globalStyles.buttonText}>Change</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.secondary,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: colors.text,
  },
  roleText: {
    color: colors.primary,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
  },
  editButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 8,
  },
  settingText: {
    fontSize: 16,
    color: colors.text,
  },
  settingArrow: {
    fontSize: 24,
    color: colors.secondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 25,
    width: '90%',
    maxWidth: 400,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginTop: 15,
    marginBottom: 5,
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 20,
  },
});

export default ProfileScreen;
