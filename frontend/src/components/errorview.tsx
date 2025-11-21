import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { globalStyles } from '../styles/globalstyle';

interface ErrorViewProps {
  message: string;
  onRetry?: () => void;
  retryText?: string;
}

const ErrorView: React.FC<ErrorViewProps> = ({ 
  message, 
  onRetry, 
  retryText = 'Try Again' 
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.errorText}>{message}</Text>
      {onRetry && (
        <TouchableOpacity style={globalStyles.button} onPress={onRetry}>
          <Text style={globalStyles.buttonText}>{retryText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default ErrorView;
