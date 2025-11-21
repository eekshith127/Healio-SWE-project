import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { LinearGradient } from 'expo-linear-gradient';
import { registerUser } from '../../api/firebaseApi';
import { useAuthStore } from '../../store/useauthstore';
import { colors } from '../../styles/colors';
import Loading from '../../components/loading';

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const preselectedRole = (route.params as any)?.role || 'patient';

  const handleRegister = async (values: { name: string; email: string; password: string; confirmPassword: string; role: string }) => {
    setLoading(true);
    try {
      const result = await registerUser(values.email, values.password, values.role, values.name);
      if (result.success && result.user) {
        const userData = {
          uid: result.user.uid,
          email: result.user.email || values.email,
          role: values.role as 'patient' | 'doctor' | 'lab' | 'admin',
        };
        await setUser(userData);
        (navigation as any).navigate('Main');
      } else {
        Alert.alert('Error', result.error || 'Registration failed');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Creating your account..." />;
  }

  const roleIcons: { [key: string]: string } = {
    patient: '🧑‍⚕️',
    doctor: '👨‍⚕️',
    lab: '🔬',
    admin: '⚙️',
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={[colors.primary, '#ff6b9d', '#ffa07a']}
        style={styles.gradient}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logo}>🩺</Text>
            <Text style={styles.appName}>Healio</Text>
            <Text style={styles.tagline}>Create Your Account</Text>
          </View>

          {/* Register Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Sign Up</Text>
            <Text style={styles.cardSubtitle}>Join as {preselectedRole.charAt(0).toUpperCase() + preselectedRole.slice(1)} {roleIcons[preselectedRole]}</Text>

            <Formik
              initialValues={{ 
                name: '', 
                email: '', 
                password: '', 
                confirmPassword: '', 
                role: preselectedRole 
              }}
              validationSchema={Yup.object({
                name: Yup.string().min(3, 'Name must be at least 3 characters').required('Name is required'),
                email: Yup.string().email('Invalid email').required('Email is required'),
                password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
                confirmPassword: Yup.string()
                  .oneOf([Yup.ref('password')], 'Passwords must match')
                  .required('Confirm password is required'),
                role: Yup.string().required('Role is required'),
              })}
              onSubmit={handleRegister}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
                <>
                  {/* Name Input */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>👤 Full Name</Text>
                    <TextInput
                      style={[styles.input, touched.name && errors.name && styles.inputError]}
                      placeholder="Enter your full name"
                      placeholderTextColor="#999"
                      value={values.name}
                      onChangeText={handleChange('name')}
                      onBlur={handleBlur('name')}
                      autoCapitalize="words"
                    />
                    {touched.name && errors.name && (
                      <Text style={styles.errorText}>{errors.name}</Text>
                    )}
                  </View>

                  {/* Email Input */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>📧 Email</Text>
                    <TextInput
                      style={[styles.input, touched.email && errors.email && styles.inputError]}
                      placeholder="Enter your email"
                      placeholderTextColor="#999"
                      value={values.email}
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      autoCapitalize="none"
                      keyboardType="email-address"
                    />
                    {touched.email && errors.email && (
                      <Text style={styles.errorText}>{errors.email}</Text>
                    )}
                  </View>

                  {/* Password Input */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>🔒 Password</Text>
                    <View style={styles.passwordContainer}>
                      <TextInput
                        style={[styles.input, styles.passwordInput, touched.password && errors.password && styles.inputError]}
                        placeholder="Enter your password"
                        placeholderTextColor="#999"
                        secureTextEntry={!showPassword}
                        value={values.password}
                        onChangeText={handleChange('password')}
                        onBlur={handleBlur('password')}
                      />
                      <TouchableOpacity 
                        style={styles.eyeButton}
                        onPress={() => setShowPassword(!showPassword)}
                      >
                        <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
                      </TouchableOpacity>
                    </View>
                    {touched.password && errors.password && (
                      <Text style={styles.errorText}>{errors.password}</Text>
                    )}
                  </View>

                  {/* Confirm Password Input */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>🔓 Confirm Password</Text>
                    <View style={styles.passwordContainer}>
                      <TextInput
                        style={[styles.input, styles.passwordInput, touched.confirmPassword && errors.confirmPassword && styles.inputError]}
                        placeholder="Re-enter your password"
                        placeholderTextColor="#999"
                        secureTextEntry={!showConfirmPassword}
                        value={values.confirmPassword}
                        onChangeText={handleChange('confirmPassword')}
                        onBlur={handleBlur('confirmPassword')}
                      />
                      <TouchableOpacity 
                        style={styles.eyeButton}
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        <Text style={styles.eyeIcon}>{showConfirmPassword ? '👁️' : '👁️‍🗨️'}</Text>
                      </TouchableOpacity>
                    </View>
                    {touched.confirmPassword && errors.confirmPassword && (
                      <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                    )}
                  </View>

                  {/* Change Role Link */}
                  <TouchableOpacity 
                    style={styles.changeRole}
                    onPress={() => (navigation as any).navigate('RoleSelection')}
                  >
                    <Text style={styles.changeRoleText}>Want to sign up as different role?</Text>
                  </TouchableOpacity>

                  {/* Register Button */}
                  <TouchableOpacity 
                    style={styles.registerButton} 
                    onPress={() => handleSubmit()}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={[colors.primary, '#ff6b9d']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.registerButtonGradient}
                    >
                      <Text style={styles.registerButtonText}>Create Account</Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  {/* Divider */}
                  <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>OR</Text>
                    <View style={styles.dividerLine} />
                  </View>

                  {/* Login Link */}
                  <TouchableOpacity 
                    style={styles.loginLink}
                    onPress={() => (navigation as any).navigate('Login')}
                  >
                    <Text style={styles.loginText}>
                      Already have an account? <Text style={styles.loginTextBold}>Sign In</Text>
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </Formik>
          </View>

          {/* Footer */}
          <Text style={styles.footer}>© 2025 Healio. All rights reserved.</Text>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
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
    fontSize: 16,
    color: colors.white,
    marginTop: 5,
    opacity: 0.9,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 25,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 16,
    color: colors.secondary,
    marginBottom: 25,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: colors.error,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeButton: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  eyeIcon: {
    fontSize: 20,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  changeRole: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  changeRoleText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  registerButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  registerButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  registerButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    marginHorizontal: 10,
    color: colors.secondary,
    fontWeight: '600',
  },
  loginLink: {
    alignItems: 'center',
  },
  loginText: {
    color: colors.text,
    fontSize: 15,
  },
  loginTextBold: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  footer: {
    textAlign: 'center',
    color: colors.white,
    fontSize: 12,
    marginTop: 30,
    opacity: 0.7,
  },
});

export default RegisterScreen;