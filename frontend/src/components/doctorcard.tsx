import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Doctor } from '../types/doctor';
import { colors } from '../styles/colors';

const globalStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 18,
    overflow: 'hidden',
    marginVertical: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 15,
  },
  imageGradient: {
    width: 70,
    height: 70,
    borderRadius: 35,
    padding: 3,
  },
  cardImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  textContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: colors.secondary,
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 13,
    color: '#FFB800',
    fontWeight: '600',
  },
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    fontSize: 18,
    color: colors.primary,
  },
});

interface DoctorCardProps {
  doctor: Doctor;
  onPress: () => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onPress }) => {
  return (
    <TouchableOpacity style={globalStyles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={globalStyles.cardContent}>
        <View style={globalStyles.imageContainer}>
          <LinearGradient
            colors={[colors.primary, '#ff6b9d']}
            style={globalStyles.imageGradient}
          >
            <Image source={{ uri: doctor.image }} style={globalStyles.cardImage} />
          </LinearGradient>
        </View>
        <View style={globalStyles.textContent}>
          <Text style={globalStyles.cardTitle}>{doctor.name}</Text>
          <Text style={globalStyles.cardSubtitle}>{doctor.specialty}</Text>
          {doctor.rating && (
            <View style={globalStyles.ratingContainer}>
              <Text style={globalStyles.rating}>⭐ {doctor.rating}</Text>
              {doctor.experience && (
                <Text style={globalStyles.cardSubtitle}> • {doctor.experience}</Text>
              )}
            </View>
          )}
        </View>
        <View style={globalStyles.arrowContainer}>
          <Text style={globalStyles.arrow}>›</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default DoctorCard;