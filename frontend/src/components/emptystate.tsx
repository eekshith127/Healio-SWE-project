import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';

interface EmptyStateProps {
  message: string;
  subtitle?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message, subtitle }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  message: {
    fontSize: 18,
    color: colors.text,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.secondary,
    textAlign: 'center',
  },
});

export default EmptyState;
