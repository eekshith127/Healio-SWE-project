import React from 'react';
import { View, Text, FlatList, TextInput, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PatientStackParamList } from '../../types/navigation';
import { useDoctorsStore } from '../../store/doctorsstore';
import DoctorCard from '../../components/doctorcard';
import Loading from '../../components/loading';
import ErrorView from '../../components/errorview';
import EmptyState from '../../components/emptystate';
import { globalStyles } from '../../styles/globalstyle';
import { Doctor } from '../../types/doctor';

type DoctorListNavigationProp = NativeStackNavigationProp<PatientStackParamList, 'Doctors'>;

const DoctorListScreen: React.FC = () => {
  const navigation = useNavigation<DoctorListNavigationProp>();
  const { doctors, loading, error, loadDoctors } = useDoctorsStore();
  const [filteredDoctors, setFilteredDoctors] = React.useState<Doctor[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDoctors();
    setRefreshing(false);
  };

  React.useEffect(() => {
    loadDoctors();
  }, []);

  React.useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredDoctors(doctors);
    } else {
      const filtered = doctors.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDoctors(filtered);
    }
  }, [searchQuery, doctors]);

  const onRefresh = React.useCallback(() => {
    handleRefresh();
  }, []);

  if (loading) {
    return <Loading message="Loading doctors..." />;
  }

  if (error) {
    return <ErrorView message={error} onRetry={loadDoctors} />;
  }

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Select a Doctor</Text>
      <TextInput
        style={globalStyles.textInput}
        placeholder="Search by name or specialty..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {filteredDoctors.length === 0 ? (
        <EmptyState 
          message={searchQuery ? "No doctors found" : "No doctors available"} 
          subtitle={searchQuery ? "Try a different search term" : "Check back later"} 
        />
      ) : (
        <FlatList
          data={filteredDoctors}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <DoctorCard doctor={item} onPress={() => navigation.navigate('DoctorDetail', { doctor: item })} />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

export default DoctorListScreen;