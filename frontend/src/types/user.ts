export interface User {
  uid: string;
  email: string;
  role: 'patient' | 'doctor' | 'lab' | 'admin';
}