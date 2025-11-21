import React, { useState } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { globalStyles } from '../../styles/globalstyle';
import Loading from '../../components/loading';
import ErrorView from '../../components/errorview';
import EmptyState from '../../components/emptystate';

interface Test {
  id: string;
  patient: string;
  test: string;
  date: string;
}

const BookedTestsScreen: React.FC = () => {
  const [tests, setTests] = useState<Test[]>([
    { id: '1', patient: 'Patient B', test: 'Blood Test', date: '2023-10-01' },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadTests = async () => {
    try {
      setError(null);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (err) {
      setError('Failed to load booked tests.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadTests();
  }, []);

  if (loading) {
    return <Loading message="Loading booked tests..." />;
  }

  if (error) {
    return <ErrorView message={error} onRetry={loadTests} />;
  }

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Booked Tests</Text>
      {tests.length === 0 ? (
        <EmptyState 
          message="No booked tests" 
          subtitle="Booked tests will appear here" 
        />
      ) : (
        <FlatList
          data={tests}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={globalStyles.card}>
              <Text style={globalStyles.cardTitle}>{item.patient}</Text>
              <Text style={globalStyles.cardSubtitle}>{item.test}</Text>
              <Text style={globalStyles.body}>Date: {item.date}</Text>
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

export default BookedTestsScreen;