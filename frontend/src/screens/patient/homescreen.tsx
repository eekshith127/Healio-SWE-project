import React, { useState } from 'react';
import { View, Text, FlatList, RefreshControl, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PatientStackParamList } from '../../types/navigation';
import { LinearGradient } from 'expo-linear-gradient';
import MenuBar from '../../components/menubar';
import { fetchEbooks } from '../../api/mockapi';
import { colors } from '../../styles/colors';
import EbookCard from '../../components/ebookcard';
import Loading from '../../components/loading';
import ErrorView from '../../components/errorview';
import EmptyState from '../../components/emptystate';
import { globalStyles } from '../../styles/globalstyle';
import { Ebook } from '../../types/ebook';

type HomeScreenNavigationProp = NativeStackNavigationProp<PatientStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [menuVisible, setMenuVisible] = useState(false);
  const [ebooks, setEbooks] = React.useState<Ebook[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [refreshing, setRefreshing] = React.useState(false);

  const loadEbooks = async () => {
    try {
      setError(null);
      const data = await fetchEbooks();
      setEbooks(data);
    } catch (err) {
      setError('Failed to load ebooks. Please try again.');
      console.error('Error loading ebooks:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  React.useEffect(() => {
    loadEbooks();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadEbooks();
  }, []);

  if (loading) {
    return <Loading message="Loading ebooks..." />;
  }

  if (error) {
    return <ErrorView message={error} onRetry={loadEbooks} />;
  }

  return (
    <>
      <MenuBar visible={menuVisible} onClose={() => setMenuVisible(false)} />
      <View style={styles.container}>
        {/* Gradient Header */}
        <LinearGradient
          colors={[colors.primary, '#ff6b9d']}
          style={styles.gradientHeader}
        >
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuButton}>
              <Text style={styles.menuIcon}>☰</Text>
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.appLogo}>🩺</Text>
              <Text style={styles.headerTitle}>Healio</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Notifications')} style={styles.notificationButton}>
              <Text style={styles.bellIcon}>🔔</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>
          <Text style={styles.welcomeText}>Your health, our priority</Text>
        </LinearGradient>

        <ScrollView contentContainerStyle={styles.scrollContent}>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => navigation.navigate('Doctors')}
        >
          <Text style={styles.actionIcon}>🩺</Text>
          <Text style={styles.actionTitle}>Find Doctors</Text>
          <Text style={styles.actionSubtitle}>Book consultation</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => navigation.navigate('MedicineSearch')}
        >
          <Text style={styles.actionIcon}>💊</Text>
          <Text style={styles.actionTitle}>Medicines</Text>
          <Text style={styles.actionSubtitle}>Search & buy</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => navigation.navigate('LabTests')}
        >
          <Text style={styles.actionIcon}>🧪</Text>
          <Text style={styles.actionTitle}>Lab Tests</Text>
          <Text style={styles.actionSubtitle}>Book tests</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => navigation.navigate('ChatBot')}
        >
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionTitle}>Health Bot</Text>
          <Text style={styles.actionSubtitle}>Get help</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => navigation.navigate('Appointments')}
        >
          <Text style={styles.actionIcon}>📅</Text>
          <Text style={styles.actionTitle}>Appointments</Text>
          <Text style={styles.actionSubtitle}>View schedule</Text>
        </TouchableOpacity>
      </View>

      {/* Health Ebooks Section */}
      <Text style={[globalStyles.subtitle, styles.sectionTitle]}>Health Resources</Text>
      {ebooks.length === 0 ? (
        <EmptyState message="No ebooks available" subtitle="Check back later for new content" />
      ) : (
        <View>
          {ebooks.map((item) => (
            <EbookCard 
              key={item.id}
              ebook={item} 
              onPress={() => navigation.navigate('Doctors')} 
            />
          ))}
        </View>
      )}
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  gradientHeader: {
    paddingTop: 20,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 20,
  },
  welcomeText: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.9,
    textAlign: 'center',
    marginTop: 10,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  actionCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 20,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  actionIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 5,
  },
  actionSubtitle: {
    fontSize: 12,
    color: colors.secondary,
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 15,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  appLogo: {
    fontSize: 28,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
  },
  menuButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
  },
  menuIcon: {
    fontSize: 22,
    color: colors.white,
  },
  notificationButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    position: 'relative',
  },
  bellIcon: {
    fontSize: 22,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default HomeScreen;