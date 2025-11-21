import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, TextInput, Modal, ScrollView, RefreshControl } from 'react-native';
import { useDoctorsStore } from '../../store/doctorsstore';
import { Doctor } from '../../types/doctor';
import { globalStyles } from '../../styles/globalstyle';
import { colors } from '../../styles/colors';
import Loading from '../../components/loading';
import ErrorView from '../../components/errorview';
import EmptyState from '../../components/emptystate';

const ManageDoctorsScreen: React.FC = () => {
  const { doctors, loading, error, loadDoctors, addDoctor, updateDoctor, deleteDoctor } = useDoctorsStore();
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    qualification: '',
    experience: '',
    description: '',
    rating: '4.5',
  });

  useEffect(() => {
    loadDoctors();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDoctors();
    setRefreshing(false);
  };

  const onRefresh = React.useCallback(() => {
    handleRefresh();
  }, []);

  const handleAdd = () => {
    setEditingDoctor(null);
    setFormData({
      name: '',
      specialty: '',
      qualification: '',
      experience: '',
      description: '',
      rating: '4.5',
    });
    setModalVisible(true);
  };

  const handleEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name,
      specialty: doctor.specialty,
      qualification: doctor.qualification || '',
      experience: doctor.experience || '',
      description: doctor.description || '',
      rating: doctor.rating.toString(),
    });
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.specialty) {
      Alert.alert('Error', 'Please fill in required fields (Name and Specialty)');
      return;
    }

    const doctorData: Doctor = {
      id: editingDoctor?.id || Date.now().toString(),
      name: formData.name,
      specialty: formData.specialty,
      qualification: formData.qualification,
      experience: formData.experience,
      description: formData.description,
      rating: parseFloat(formData.rating) || 4.5,
      image: editingDoctor?.image || `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 99)}.jpg`,
    };

    if (editingDoctor) {
      // Update existing doctor in global store
      updateDoctor(editingDoctor.id, doctorData);
      Alert.alert('Success', '✅ Doctor updated successfully!\n\nChanges are now live across all screens.');
    } else {
      // Add new doctor to global store
      addDoctor(doctorData);
      Alert.alert('Success', '✅ New doctor added successfully!\n\nDoctor is now visible in all lists.');
    }

    setModalVisible(false);
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert('Delete Doctor', `Are you sure you want to delete ${name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          // Delete from global store
          deleteDoctor(id);
          Alert.alert('Success', `✅ ${name} has been removed!\n\nChanges are now live across all screens.`);
        },
      },
    ]);
  };

  if (loading) {
    return <Loading message="Loading doctors..." />;
  }

  if (error) {
    return <ErrorView message={error} onRetry={loadDoctors} />;
  }

  return (
    <View style={globalStyles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Text style={globalStyles.title}>Manage Doctors</Text>
        <TouchableOpacity
          style={[globalStyles.button, { backgroundColor: colors.success, paddingVertical: 10, paddingHorizontal: 15 }]}
          onPress={handleAdd}
        >
          <Text style={globalStyles.buttonText}>+ Add Doctor</Text>
        </TouchableOpacity>
      </View>

      {doctors.length === 0 ? (
        <EmptyState message="No doctors found" subtitle="Add doctors to the system" />
      ) : (
        <FlatList
          data={doctors}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={globalStyles.card}>
              <Text style={globalStyles.cardTitle}>{item.name}</Text>
              <Text style={globalStyles.cardSubtitle}>{item.specialty}</Text>
              {item.qualification && <Text style={globalStyles.body}>Qualification: {item.qualification}</Text>}
              {item.experience && <Text style={globalStyles.body}>Experience: {item.experience}</Text>}
              <Text style={globalStyles.body}>Rating: {item.rating} ⭐</Text>
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                <TouchableOpacity
                  style={[globalStyles.button, { flex: 1, backgroundColor: colors.primary }]}
                  onPress={() => handleEdit(item)}
                >
                  <Text style={globalStyles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[globalStyles.button, { flex: 1, backgroundColor: colors.error }]}
                  onPress={() => handleDelete(item.id, item.name)}
                >
                  <Text style={globalStyles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}

      {/* Add/Edit Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 }}>
          <View style={{ backgroundColor: 'white', borderRadius: 10, padding: 20, maxHeight: '90%' }}>
            <ScrollView>
              <Text style={[globalStyles.title, { marginBottom: 20 }]}>
                {editingDoctor ? 'Edit Doctor' : 'Add Doctor'}
              </Text>

              <Text style={globalStyles.subtitle}>Name *</Text>
              <TextInput
                style={globalStyles.textInput}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="Dr. John Doe"
              />

              <Text style={globalStyles.subtitle}>Specialty *</Text>
              <TextInput
                style={globalStyles.textInput}
                value={formData.specialty}
                onChangeText={(text) => setFormData({ ...formData, specialty: text })}
                placeholder="Cardiology"
              />

              <Text style={globalStyles.subtitle}>Qualification</Text>
              <TextInput
                style={globalStyles.textInput}
                value={formData.qualification}
                onChangeText={(text) => setFormData({ ...formData, qualification: text })}
                placeholder="MD, FACC"
              />

              <Text style={globalStyles.subtitle}>Experience</Text>
              <TextInput
                style={globalStyles.textInput}
                value={formData.experience}
                onChangeText={(text) => setFormData({ ...formData, experience: text })}
                placeholder="15 years"
              />

              <Text style={globalStyles.subtitle}>Description</Text>
              <TextInput
                style={[globalStyles.textInput, { height: 80 }]}
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                placeholder="Specialized in..."
                multiline
              />

              <Text style={globalStyles.subtitle}>Rating (0-5)</Text>
              <TextInput
                style={globalStyles.textInput}
                value={formData.rating}
                onChangeText={(text) => setFormData({ ...formData, rating: text })}
                placeholder="4.5"
                keyboardType="numeric"
              />

              <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
                <TouchableOpacity
                  style={[globalStyles.button, { flex: 1, backgroundColor: colors.secondary }]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={globalStyles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[globalStyles.button, { flex: 1, backgroundColor: colors.success }]}
                  onPress={handleSave}
                >
                  <Text style={globalStyles.buttonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ManageDoctorsScreen;
