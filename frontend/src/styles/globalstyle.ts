import { StyleSheet } from 'react-native';
import { colors } from './colors';
import { typography } from './typography';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
  },
  
  title: {
    ...typography.title,
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    ...typography.subtitle,
    marginBottom: 10,
  },
  body: {
    ...typography.body,
    marginBottom: 10,
  },
  card: {
    backgroundColor: colors.white,
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 3,
  },
  cardImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  cardTitle: {
    ...typography.subtitle,
  },
  cardSubtitle: {
    ...typography.caption,
  },
  cardContent: {
    flex: 1,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: colors.white,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 5,
  },
  buttonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  sendButton: {
    backgroundColor: colors.success,
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  sendButtonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginBottom: 5,
  },
  linkText: {
    color: colors.primary,
    textAlign: 'center',
    marginTop: 10,
  },
});