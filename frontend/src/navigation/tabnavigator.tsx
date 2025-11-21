import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/useauthstore';

// Import Ionicons properly
import Ionicons from '@expo/vector-icons/Ionicons';
import HomeScreen from '../screens/patient/homescreen';
import DoctorListScreen from '../screens/patient/doctorlistscreen';
import DoctorDetailScreen from '../screens/patient/doctordetailscreen';
import AppointmentScreen from '../screens/patient/appointmentscreen';
import LabTestsScreen from '../screens/patient/labtestsscreen';
import LabDetailScreen from '../screens/patient/labdetailscreen';
import DashboardScreen from '../screens/doctor/dashboardscreen';
import PatientRequestsScreen from '../screens/doctor/patientrequestscreen';
import LabDashboardScreen from '../screens/lab/labdashscreen';
import BookedTestsScreen from '../screens/lab/booktestscreen';
import AdminDashboard from '../screens/admin/admindashboard';
import ManageUsersScreen from '../screens/admin/manageuserscreen';
import AnalyticsScreen from '../screens/admin/analyticsscreen';
import ManageDoctorsScreen from '../screens/admin/managedoctorsscreen';
import ChatBotScreen from '../screens/chatbot/chatbotscreen';
import ProfileScreen from '../screens/settings/profilescreen';
import MedicineSearchScreen from '../screens/patient/medicinesearchscreen';
import NotificationScreen from '../screens/patient/notificationscreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Patient Stack Navigator
const PatientStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true, headerBackTitleVisible: false }}>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Doctors" component={DoctorListScreen} options={{ title: 'Doctors' }} />
      <Stack.Screen name="DoctorDetail" component={DoctorDetailScreen} options={{ title: 'Doctor Details' }} />
      <Stack.Screen name="LabTests" component={LabTestsScreen} options={{ title: 'Lab Tests' }} />
      <Stack.Screen name="LabDetail" component={LabDetailScreen} options={{ title: 'Lab Details' }} />
      <Stack.Screen name="Appointments" component={AppointmentScreen} options={{ title: 'My Appointments' }} />
      <Stack.Screen name="ChatBot" component={ChatBotScreen} options={{ title: 'Chat Bot' }} />
      <Stack.Screen name="MedicineSearch" component={MedicineSearchScreen} options={{ title: 'Medicine Search' }} />
      <Stack.Screen name="Notifications" component={NotificationScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Stack.Navigator>
  );
};

// Doctor Stack Navigator
const DoctorStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true, headerBackTitleVisible: false }}>
      <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Doctor Dashboard' }} />
      <Stack.Screen name="PatientRequests" component={PatientRequestsScreen} options={{ title: 'Patient Requests' }} />
      <Stack.Screen name="Notifications" component={NotificationScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Stack.Navigator>
  );
};

// Lab Stack Navigator
const LabStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true, headerBackTitleVisible: false }}>
      <Stack.Screen name="Dashboard" component={LabDashboardScreen} options={{ title: 'Lab Dashboard' }} />
      <Stack.Screen name="BookedTests" component={BookedTestsScreen} options={{ title: 'Booked Tests' }} />
      <Stack.Screen name="Notifications" component={NotificationScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Stack.Navigator>
  );
};

// Admin Stack Navigator
const AdminStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true, headerBackTitleVisible: false }}>
      <Stack.Screen name="AdminDashboard" component={AdminDashboard} options={{ title: 'Admin Dashboard' }} />
      <Stack.Screen name="ManageUsers" component={ManageUsersScreen} options={{ title: 'Manage Users' }} />
      <Stack.Screen name="ManageDoctors" component={ManageDoctorsScreen} options={{ title: 'Manage Doctors' }} />
      <Stack.Screen name="Analytics" component={AnalyticsScreen} options={{ title: 'Analytics' }} />
      <Stack.Screen name="Notifications" component={NotificationScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Stack.Navigator>
  );
};

const TabNavigator: React.FC = () => {
  const { user } = useAuthStore();

  if (user?.role === 'patient') {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: any = 'help-outline';

            if (route.name === 'PatientHome') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Search') {
              iconName = focused ? 'search' : 'search-outline';
            } else if (route.name === 'ChatBot') {
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#e74bcdff',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}
      >
        <Tab.Screen name="PatientHome" component={PatientStack} options={{ title: 'Home' }} />
        <Tab.Screen name="Search" component={DoctorListScreen} options={{ title: 'Search' }} />
        <Tab.Screen name="ChatBot" component={ChatBotScreen} options={{ title: 'Chat' }} />
        <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
      </Tab.Navigator>
    );
  }
  
  if (user?.role === 'doctor') {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: any = 'help-outline';
            
            if (route.name === 'DoctorHome') {
              iconName = focused ? 'medical' : 'medical-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            }
            
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#e74bcdff',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}
      >
        <Tab.Screen name="DoctorHome" component={DoctorStack} options={{ title: 'Dashboard' }} />
        <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
      </Tab.Navigator>
    );
  }
  
  if (user?.role === 'lab') {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: any = 'help-outline';
            
            if (route.name === 'LabHome') {
              iconName = focused ? 'flask' : 'flask-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            }
            
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#e74bcdff',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}
      >
        <Tab.Screen name="LabHome" component={LabStack} options={{ title: 'Dashboard' }} />
        <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
      </Tab.Navigator>
    );
  }
  
  if (user?.role === 'admin') {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: any = 'help-outline';
            
            if (route.name === 'AdminHome') {
              iconName = focused ? 'settings' : 'settings-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            }
            
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#e74bcdff',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}
      >
        <Tab.Screen name="AdminHome" component={AdminStack} options={{ title: 'Dashboard' }} />
        <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
      </Tab.Navigator>
    );
  }
  
  // Fallback (shouldn't reach here if auth is working)
  return <Tab.Navigator><Tab.Screen name="AdminHome" component={AdminStack} options={{ title: 'Dashboard' }} /></Tab.Navigator>;
};

export default TabNavigator;