import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { globalStyles } from '../../styles/globalstyle';
import Loading from '../../components/loading';
import ErrorView from '../../components/errorview';
import EmptyState from '../../components/emptystate';
import { fetchMyAppointments, updateAppointmentStatus } from '../../api/bookingApi';
import { fetchUserById } from '../../api/usersapi';

interface Request {
  id: string;
  patient: string;
  date: string;
  status: string;
}

const PatientRequestsScreen: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadRequests = async () => {
    try {
      setError(null);
      setLoading(true);

      // Fetch all appointments for this doctor
      const appointments = await fetchMyAppointments();

      // Filter to pending requests (treat missing status as pending)
      const pending = appointments.filter((appt: any) => {
        const status = appt.status || 'Pending';
        return status.toLowerCase() === 'pending';
      });

      if (pending.length === 0) {
        setRequests([]);
        return;
      }

      // Load patient names for each unique patient id
      const uniquePatientIds = Array.from(new Set(pending.map((appt: any) => appt.patient)));
      const patientResults = await Promise.all(
        uniquePatientIds.map(async (id) => {
          try {
            const user = await fetchUserById(id);
            return { id, name: user.name || user.email.split('@')[0] };
          } catch {
            return { id, name: 'Patient' };
          }
        })
      );

      const patientNameMap = new Map(patientResults.map(p => [p.id, p.name]));

      const mapped: Request[] = pending.map((appt: any) => {
        const rawStatus = appt.status || 'Pending';
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
          patient: patientNameMap.get(appt.patient) || 'Patient',
          date: appt.datetime ? new Date(appt.datetime).toLocaleString() : '',
          status: displayStatus,
        };
      });

      setRequests(mapped);
    } catch (err) {
      setError('Failed to load requests.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleAccept = (id: string) => {
    Alert.alert('Accept Request', 'Accept this appointment request?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Accept',
        onPress: async () => {
          try {
            await updateAppointmentStatus(id, 'Confirmed');
            setRequests(prev => prev.filter(req => req.id !== id));
            Alert.alert('Success', 'Request accepted');
          } catch (err) {
            Alert.alert('Error', 'Failed to accept request. Please try again.');
          }
        },
      },
    ]);
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadRequests();
  }, []);

  useEffect(() => {
    loadRequests();
  }, []);

  if (loading) {
    return <Loading message="Loading requests..." />;
  }

  if (error) {
    return <ErrorView message={error} onRetry={loadRequests} />;
  }

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Patient Requests</Text>
      {requests.length === 0 ? (
        <EmptyState 
          message="No patient requests" 
          subtitle="Patient requests will appear here" 
        />
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={globalStyles.card}>
              <Text style={globalStyles.cardTitle}>{item.patient}</Text>
              <Text style={globalStyles.cardSubtitle}>{item.date}</Text>
              <Text style={[globalStyles.body, { marginVertical: 5 }]}>
                Status: {item.status}
              </Text>
              {item.status.toLowerCase() === 'pending' && (
                <TouchableOpacity style={globalStyles.button} onPress={() => handleAccept(item.id)}>
                  <Text style={globalStyles.buttonText}>Accept</Text>
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

export default PatientRequestsScreen;