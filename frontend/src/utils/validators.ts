export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6; // Basic check; expand as needed
};

export const validateRole = (role: string): boolean => {
  return ['patient', 'doctor', 'lab', 'admin'].includes(role);
};