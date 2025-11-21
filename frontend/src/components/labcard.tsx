import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Lab } from '../types/lab';
import { globalStyles } from '../styles/globalstyle';

interface LabCardProps {
  lab: Lab;
  onPress: () => void;
}

const LabCard: React.FC<LabCardProps> = ({ lab, onPress }) => {
  return (
    <TouchableOpacity style={globalStyles.card} onPress={onPress}>
      <Image source={{ uri: lab.image }} style={globalStyles.cardImage} />
      <View style={globalStyles.cardContent}>
        <Text style={globalStyles.cardTitle}>{lab.name}</Text>
        <Text style={globalStyles.cardSubtitle}>{lab.location}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default LabCard;