import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ebook } from '../types/ebook';

interface EbookCardProps {
  ebook: Ebook;
  onPress: () => void;
}

const EbookCard: React.FC<EbookCardProps> = ({ ebook, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: ebook.cover }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{ebook.title}</Text>
        <Text style={styles.cardSubtitle}>{ebook.author}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 8,
    marginHorizontal: 12,
    elevation: 2,
  },
  cardImage: {
    width: 80,
    height: 120,
  },
  cardContent: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
  },
});

export default EbookCard;