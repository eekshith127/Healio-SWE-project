import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, RefreshControl, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PatientStackParamList } from '../../types/navigation';
import { fetchLabs } from '../../api/mockapi';
import { Lab } from '../../types/lab';
import { globalStyles } from '../../styles/globalstyle';
import { colors } from '../../styles/colors';
import Loading from '../../components/loading';
import ErrorView from '../../components/errorview';
import EmptyState from '../../components/emptystate';

type LabTestsNavigationProp = NativeStackNavigationProp<PatientStackParamList, 'LabTests'>;

const LabTestsScreen: React.FC = () => {
  const navigation = useNavigation<LabTestsNavigationProp>();
  const [labs, setLabs] = useState<Lab[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadLabs();
  }, []);

  const loadLabs = async () => {
    try {
      setError(null);
      const data = await fetchLabs();
      setLabs(data);
    } catch (err) {
      setError('Failed to load labs');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadLabs();
  };

  const handleBookTest = (lab: Lab) => {
    navigation.navigate('LabDetail', { lab });
  };

  if (loading) {
    return <Loading message="Loading labs..." />;
  }

  if (error) {
    return <ErrorView message={error} onRetry={loadLabs} />;
  }

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Book Lab Tests</Text>
      
      {labs.length === 0 ? (
        <EmptyState message="No labs available" subtitle="Please check back later" />
      ) : (
        <FlatList
          data={labs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.labCard}
              onPress={() => handleBookTest(item)}
            >
              <Image 
                source={{ uri: item.image }} 
                style={styles.labImage}
              />
              <View style={styles.labInfo}>
                <Text style={styles.labName}>{item.name}</Text>
                <Text style={styles.labLocation}>📍 {item.location}</Text>
                <View style={styles.features}>
                  <Text style={styles.featureTag}>✓ Home Collection</Text>
                  <Text style={styles.featureTag}>✓ Quick Results</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  labCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  labImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  labInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  labName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 5,
  },
  labLocation: {
    fontSize: 14,
    color: colors.secondary,
    marginBottom: 8,
  },
  features: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  featureTag: {
    fontSize: 12,
    color: colors.success,
    marginRight: 10,
    fontWeight: '500',
  },
});

export default LabTestsScreen;
