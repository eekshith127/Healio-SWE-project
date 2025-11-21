import { Doctor } from './doctor';
import { Lab } from './lab';

// Patient Stack Parameter List
export type PatientStackParamList = {
  Home: undefined;
  Doctors: undefined;
  DoctorDetail: { doctor: Doctor };
  LabTests: undefined;
  LabDetail: { lab: Lab };
  Appointments: undefined;
  ChatBot: undefined;
  MedicineSearch: undefined;
  Notifications: undefined;
  Profile: undefined;
};

// Doctor Stack Parameter List
export type DoctorStackParamList = {
  Dashboard: undefined;
  PatientRequests: undefined;
};

// Lab Stack Parameter List
export type LabStackParamList = {
  Dashboard: undefined;
  BookedTests: undefined;
};

// Admin Stack Parameter List
export type AdminStackParamList = {
  AdminDashboard: undefined;
  ManageUsers: undefined;
  ManageDoctors: undefined;
  Analytics: undefined;
};

// Root Navigator Parameter List
export type RootStackParamList = PatientStackParamList & DoctorStackParamList & LabStackParamList & AdminStackParamList;
