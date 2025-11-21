import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { globalStyles } from '../../styles/globalstyle';
import Loading from '../../components/loading';
import ErrorView from '../../components/errorview';
import EmptyState from '../../components/emptystate';
import { fetchMyAppointments, cancelAppointment } from '../../api/bookingApi';
import { useDoctorsStore } from '../../store/doctorsstore';

interface AppointmentItem {
  id: string;
  doctor: string;
  date: string;
  status: string;
}

const AppointmentScreen: React.FC = () => {
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadAppointments = async () => {
    try {
      setError(null);
      setLoading(true);

      // Ensure we have latest doctors list for mapping
      const doctorsStore = useDoctorsStore.getState();
      if (doctorsStore.doctors.length === 0) {
        await doctorsStore.loadDoctors();
      }

      const backendAppointments = await fetchMyAppointments();
      const currentDoctors = useDoctorsStore.getState().doctors;

      const mapped: AppointmentItem[] = backendAppointments.map(appt => {
        const doctor = currentDoctors.find(d => d.id === appt.doctor);

        const rawStatus = (appt as any).status || 'Pending';
        const normalized = typeof rawStatus === 'string'
          ? rawStatus.toLowerCase()
          : String(rawStatus).toLowerCase();

        let displayStatus = 'Pending';
        if (normalized === 'confirmed') {
          displayStatus = 'Confirmed';
        } else if (normalized === 'cancelled') {
          displayStatus = 'Cancelled';
        } else if (normalized === 'pending') {
          displayStatus = 'Pending';
        } else {
          displayStatus = String(rawStatus);
        }

        return {
          id: appt._id,
          doctor: doctor?.name || 'Doctor',
          date: appt.datetime ? new Date(appt.datetime).toLocaleString() : '',
          status: displayStatus,
        };
      });

      setAppointments(mapped);
    } catch (err) {
      setError('Failed to load appointments.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleCancel = (id: string, doctor: string) => {
    Alert.alert(
      'Cancel Appointment',
      `Are you sure you want to cancel your appointment with ${doctor}?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelAppointment(id);
              setAppointments(prev => prev.filter(apt => apt.id !== id));
              Alert.alert('Success', 'Appointment cancelled successfully');
            } catch (err) {
              Alert.alert('Error', 'Failed to cancel appointment. Please try again.');
            }
          },
        },
      ]
    );
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadAppointments();
  }, []);

  useEffect(() => {
    loadAppointments();
  }, []);

  if (loading) {
    return <Loading message="Loading appointments..." />;
  }

  if (error) {
    return <ErrorView message={error} onRetry={loadAppointments} />;
  }

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>My Appointments</Text>
      {appointments.length === 0 ? (
        <EmptyState 
          message="No appointments scheduled" 
          subtitle="Book an appointment with a doctor to get started" 
        />
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={globalStyles.card}>
              <Text style={globalStyles.cardTitle}>{item.doctor}</Text>
              <Text style={globalStyles.cardSubtitle}>{item.date}</Text>
              <Text style={[globalStyles.body, { marginVertical: 5 }]}>
                Status: {item.status}
              </Text>
              {item.status !== 'Cancelled' && (
                <TouchableOpacity
                  style={[globalStyles.button, { backgroundColor: '#dc3545', marginTop: 10 }]}
                  onPress={() => handleCancel(item.id, item.doctor)}
                >
                  <Text style={globalStyles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

export default AppointmentScreen;