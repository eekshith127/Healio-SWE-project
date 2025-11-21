import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Platform, Image, ScrollView, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PatientStackParamList } from '../../types/navigation';
import DateTimePicker from '@react-native-community/datetimepicker';
import { bookAppointment } from '../../api/bookingApi';
import { globalStyles } from '../../styles/globalstyle';
import { colors } from '../../styles/colors';
import { Doctor } from '../../types/doctor';
import Loading from '../../components/loading';

type DoctorDetailNavigationProp = NativeStackNavigationProp<PatientStackParamList, 'DoctorDetail'>;

const DoctorDetailScreen: React.FC = () => {
  const navigation = useNavigation<DoctorDetailNavigationProp>();
  const route = useRoute();
  const { doctor } = route.params as { doctor: Doctor };
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleBook = async () => {
    if (!selectedDate || selectedDate < new Date()) {
      Alert.alert('Invalid Date', 'Please select a future date');
      return;
    }

    setLoading(true);
    try {
      const result = await bookAppointment({
        doctorId: doctor.id,
        datetime: selectedDate.toISOString(),
      });
      if (result && result._id) {
        Alert.alert('Success', 'Appointment booked successfully!', [
          { text: 'OK', onPress: () => navigation.navigate('Appointments') },
        ]);
      } else {
        Alert.alert('Error', 'Failed to book appointment. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return <Loading message="Booking appointment..." />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Doctor Profile Header */}
      <View style={styles.header}>
        <Image 
          source={{ uri: doctor.image }} 
          style={styles.doctorImage}
        />
        <View style={styles.headerInfo}>
          <Text style={globalStyles.title}>{doctor.name}</Text>
          <Text style={[globalStyles.subtitle, { color: colors.primary }]}>{doctor.specialty}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>⭐ {doctor.rating}</Text>
            {doctor.experience && (
              <Text style={styles.experience}> • {doctor.experience}</Text>
            )}
          </View>
        </View>
      </View>

      {/* Qualifications */}
      {doctor.qualification && (
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Qualifications</Text>
          <Text style={styles.cardText}>{doctor.qualification}</Text>
        </View>
      )}

      {/* About */}
      {doctor.description && (
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>About</Text>
          <Text style={styles.cardText}>{doctor.description}</Text>
        </View>
      )}

      {/* Experience */}
      {doctor.experience && (
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Experience</Text>
          <Text style={styles.cardText}>{doctor.experience} of practice</Text>
        </View>
      )}

      {/* Appointment Booking Section */}
      <View style={styles.bookingSection}>
        <Text style={styles.sectionTitle}>Book Appointment</Text>
        
        <Text style={styles.label}>Select Date</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateButtonText}>
            📅 {formatDate(selectedDate)}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, date) => {
              setShowDatePicker(Platform.OS === 'ios');
              if (date) {
                setSelectedDate(date);
              }
            }}
            minimumDate={new Date()}
          />
        )}

        <TouchableOpacity 
          style={[globalStyles.button, styles.bookButton]} 
          onPress={handleBook}
        >
          <Text style={globalStyles.buttonText}>Confirm Booking</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  doctorImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 15,
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  experience: {
    fontSize: 14,
    color: colors.secondary,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: colors.secondary,
    lineHeight: 20,
  },
  bookingSection: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 20,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 10,
  },
  dateButton: {
    backgroundColor: colors.background,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    marginBottom: 20,
  },
  dateButtonText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
  },
  bookButton: {
    marginTop: 10,
  },
});

export default DoctorDetailScreen;