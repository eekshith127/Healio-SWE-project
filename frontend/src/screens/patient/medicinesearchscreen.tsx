import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, RefreshControl, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PatientStackParamList } from '../../types/navigation';
import { fetchMedicines } from '../../api/mockapi';
import { Medicine } from '../../types/medicine';
import { globalStyles } from '../../styles/globalstyle';
import { colors } from '../../styles/colors';
import Loading from '../../components/loading';
import ErrorView from '../../components/errorview';
import EmptyState from '../../components/emptystate';

type MedicineSearchNavigationProp = NativeStackNavigationProp<PatientStackParamList, 'Home'>;

const MedicineSearchScreen: React.FC = () => {
  const navigation = useNavigation<MedicineSearchNavigationProp>();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);

  const loadMedicines = async () => {
    try {
      setError(null);
      const data = await fetchMedicines();
      setMedicines(data);
      setFilteredMedicines(data);
    } catch (err) {
      setError('Failed to load medicines. Please try again.');
      console.error('Error loading medicines:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadMedicines();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredMedicines(medicines);
    } else {
      const filtered = medicines.filter(
        (medicine) =>
          medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          medicine.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          medicine.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMedicines(filtered);
    }
  }, [searchQuery, medicines]);

  const onRefresh = () => {
    setRefreshing(true);
    loadMedicines();
  };

  if (loading) {
    return <Loading message="Loading medicines..." />;
  }

  if (error) {
    return <ErrorView message={error} onRetry={loadMedicines} />;
  }

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Medicine Search</Text>
      <TextInput
        style={globalStyles.textInput}
        placeholder="Search medicines by name, generic name, or category..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      
      {selectedMedicine ? (
        <ScrollView style={styles.detailContainer}>
          <View style={styles.detailCard}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => setSelectedMedicine(null)}
            >
              <Text style={styles.backButtonText}>← Back to List</Text>
            </TouchableOpacity>
            
            <Text style={styles.medicineName}>{selectedMedicine.name}</Text>
            <Text style={styles.genericName}>{selectedMedicine.genericName}</Text>
            
            <View style={styles.priceContainer}>
              <Text style={styles.price}>₹{selectedMedicine.price}</Text>
              {selectedMedicine.prescriptionRequired && (
                <View style={styles.prescriptionBadge}>
                  <Text style={styles.prescriptionText}>Rx Required</Text>
                </View>
              )}
              {!selectedMedicine.inStock && (
                <View style={[styles.prescriptionBadge, { backgroundColor: colors.error }]}>
                  <Text style={styles.prescriptionText}>Out of Stock</Text>
                </View>
              )}
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Manufacturer</Text>
              <Text style={styles.sectionContent}>{selectedMedicine.manufacturer}</Text>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Category</Text>
              <Text style={styles.sectionContent}>{selectedMedicine.category}</Text>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.sectionContent}>{selectedMedicine.description}</Text>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Dosage</Text>
              <Text style={styles.sectionContent}>{selectedMedicine.dosage}</Text>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Side Effects</Text>
              {selectedMedicine.sideEffects.map((effect, index) => (
                <Text key={index} style={styles.listItem}>• {effect}</Text>
              ))}
            </View>
          </View>
        </ScrollView>
      ) : (
        <>
          {filteredMedicines.length === 0 ? (
            <EmptyState 
              message={searchQuery ? "No medicines found" : "No medicines available"} 
              subtitle={searchQuery ? "Try a different search term" : "Check back later"} 
            />
          ) : (
            <FlatList
              data={filteredMedicines}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.medicineCard}
                  onPress={() => setSelectedMedicine(item)}
                >
                  <View style={styles.cardHeader}>
                    <View style={styles.cardTitleContainer}>
                      <Text style={styles.cardTitle}>{item.name}</Text>
                      <Text style={styles.cardSubtitle}>{item.genericName}</Text>
                    </View>
                    <Text style={styles.cardPrice}>₹{item.price}</Text>
                  </View>
                  
                  <View style={styles.cardBody}>
                    <Text style={styles.category}>{item.category}</Text>
                    {item.prescriptionRequired && (
                      <View style={styles.rxBadge}>
                        <Text style={styles.rxText}>Rx</Text>
                      </View>
                    )}
                    {!item.inStock && (
                      <View style={[styles.rxBadge, { backgroundColor: colors.error }]}>
                        <Text style={styles.rxText}>Out of Stock</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              )}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  medicineCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: colors.secondary,
  },
  cardPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  category: {
    fontSize: 13,
    color: colors.secondary,
    backgroundColor: colors.background,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rxBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rxText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.white,
  },
  detailContainer: {
    flex: 1,
  },
  detailCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  backButton: {
    marginBottom: 15,
  },
  backButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  medicineName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  genericName: {
    fontSize: 18,
    color: colors.secondary,
    marginBottom: 15,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
  },
  prescriptionBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  prescriptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  infoSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 14,
    color: colors.secondary,
    lineHeight: 20,
  },
  listItem: {
    fontSize: 14,
    color: colors.secondary,
    marginBottom: 4,
    lineHeight: 20,
  },
});

export default MedicineSearchScreen;
