import doctorsData from '../data/doctor.json';
import labsData from '../data/labs.json';
import ebooksData from '../data/ebooks.json';
import medicinesData from '../data/medicines.json';
import notificationsData from '../data/notifications.json';
import usersData from '../data/users.json';

export const fetchDoctors = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return doctorsData;
};

export const fetchLabs = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return labsData;
};

export const fetchEbooks = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return ebooksData;
};

export const bookAppointment = async (doctorId: string, date: string) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true, message: 'Appointment booked' };
};

export const sendChatMessage = async (message: string) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { response: `AI Response to: ${message}` };
};

export const fetchMedicines = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return medicinesData;
};

export const fetchNotifications = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return notificationsData;
};

export const markNotificationAsRead = async (notificationId: string) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return { success: true };
};

export const fetchUsers = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return usersData;
};

export const updateUser = async (userId: string, updates: Partial<typeof usersData[0]>) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return { success: true, user: { ...updates } };
};

export const deleteUser = async (userId: string) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return { success: true };
};

export const getUserStats = async () => {
  await new Promise(resolve => setTimeout(resolve, 400));
  const totalUsers = usersData.length;
  const patients = usersData.filter(u => u.role === 'patient').length;
  const doctors = usersData.filter(u => u.role === 'doctor').length;
  const labs = usersData.filter(u => u.role === 'lab').length;
  const admins = usersData.filter(u => u.role === 'admin').length;
  const activeToday = usersData.filter(u => {
    const lastActive = new Date(u.lastActive);
    const today = new Date();
    return lastActive.toDateString() === today.toDateString();
  }).length;
  
  return {
    totalUsers,
    patients,
    doctors,
    labs,
    admins,
    activeToday,
    activeUsers: usersData.filter(u => u.status === 'active').length,
    onlineNow: 0, // Will be calculated by store
    recentLogins: [], // Will be calculated by store
  };
};