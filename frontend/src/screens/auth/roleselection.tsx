import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../styles/colors';

interface RoleOption {
  id: string;
  title: string;
  icon: string;
  description: string;
  color: [string, string];
}

const RoleSelection: React.FC = () => {
  const navigation = useNavigation();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const roles: RoleOption[] = [
    {
      id: 'patient',
      title: 'Patient',
      icon: '🧑‍⚕️',
      description: 'Book appointments, consult doctors, order medicines',
      color: ['#e74bcdff', '#ff6b9d'],
    },
    {
      id: 'doctor',
      title: 'Doctor',
      icon: '👨‍⚕️',
      description: 'Manage patients, view appointments, consultations',
      color: ['#6366f1', '#8b5cf6'],
    },
    {
      id: 'lab',
      title: 'Laboratory',
      icon: '🔬',
      description: 'Manage tests, upload results, track samples',
      color: ['#10b981', '#14b8a6'],
    },
    {
      id: 'admin',
      title: 'Administrator',
      icon: '⚙️',
      description: 'System management, analytics, user control',
      color: ['#f59e0b', '#ef4444'],
    },
  ];

  const selectRole = (role: string) => {
    setSelectedRole(role);
    setTimeout(() => {
      (navigation as any).navigate('Register', { role });
    }, 300);
  };

  return (
    <LinearGradient
      colors={[colors.primary, '#ff6b9d', '#ffa07a']}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>🩺</Text>
          <Text style={styles.appName}>Healio</Text>
          <Text style={styles.tagline}>Join as...</Text>
        </View>

        {/* Role Cards */}
        <View style={styles.rolesContainer}>
          {roles.map((role) => (
            <TouchableOpacity
              key={role.id}
              style={[
                styles.roleCard,
                selectedRole === role.id && styles.roleCardSelected,
              ]}
              onPress={() => selectRole(role.id)}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={role.color}
                style={styles.iconGradient}
              >
                <Text style={styles.roleIcon}>{role.icon}</Text>
              </LinearGradient>
              <View style={styles.roleContent}>
                <Text style={styles.roleTitle}>{role.title}</Text>
                <Text style={styles.roleDescription}>{role.description}</Text>
              </View>
              <View style={styles.arrowContainer}>
                <Text style={styles.arrow}>›</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Already have account */}
        <TouchableOpacity 
          style={styles.loginLink}
          onPress={() => navigation.navigate('Login' as never)}
        >
          <Text style={styles.loginText}>
            Already have an account? <Text style={styles.loginTextBold}>Sign In</Text>
          </Text>
        </TouchableOpacity>

        {/* Footer */}
        <Text style={styles.footer}> 2025 Healio. All rights reserved.</Text>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 70,
    marginBottom: 10,
  },
  appName: {
    fontSize: 42,
    fontWeight: 'bold',
    color: colors.white,
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 24,
    color: colors.white,
    marginTop: 10,
    opacity: 0.9,
    fontWeight: '600',
  },
  rolesContainer: {
    gap: 15,
  },
  roleCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
    transform: [{ scale: 1 }],
  },
  roleCardSelected: {
    borderWidth: 3,
    borderColor: colors.white,
    transform: [{ scale: 0.98 }],
  },
  iconGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  roleIcon: {
    fontSize: 30,
  },
  roleContent: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  roleDescription: {
    fontSize: 13,
    color: colors.secondary,
    lineHeight: 18,
  },
  arrowContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    fontSize: 24,
    color: colors.primary,
    fontWeight: 'bold',
  },
  loginLink: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  loginText: {
    color: colors.white,
    fontSize: 15,
  },
  loginTextBold: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  footer: {
    textAlign: 'center',
    color: colors.white,
    fontSize: 12,
    opacity: 0.7,
    marginTop: 10,
  },
});

export default RoleSelection;