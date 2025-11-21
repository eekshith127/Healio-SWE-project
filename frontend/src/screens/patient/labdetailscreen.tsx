import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, StyleSheet, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Lab } from '../../types/lab';
import { globalStyles } from '../../styles/globalstyle';
import { colors } from '../../styles/colors';

interface TestPackage {
  id: string;
  name: string;
  price: number;
  tests: string[];
}

const LabDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { lab } = route.params as { lab: Lab };
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  // Mock test packages
  const packages: TestPackage[] = [
    {
      id: '1',
      name: 'Complete Blood Count (CBC)',
      price: 500,
      tests: ['Hemoglobin', 'WBC Count', 'Platelet Count', 'RBC Count'],
    },
    {
      id: '2',
      name: 'Lipid Profile',
      price: 800,
      tests: ['Total Cholesterol', 'HDL', 'LDL', 'Triglycerides'],
    },
    {
      id: '3',
      name: 'Liver Function Test',
      price: 1200,
      tests: ['SGOT', 'SGPT', 'Bilirubin', 'Albumin', 'Total Protein'],
    },
    {
      id: '4',
      name: 'Thyroid Profile',
      price: 1000,
      tests: ['TSH', 'T3', 'T4'],
    },
    {
      id: '5',
      name: 'Diabetes Screening',
      price: 600,
      tests: ['Fasting Blood Sugar', 'HbA1c', 'Post Prandial'],
    },
  ];

  const handleBookTest = () => {
    if (!selectedPackage) {
      Alert.alert('Error', 'Please select a test package');
      return;
    }

    const selectedPkg = packages.find(p => p.id === selectedPackage);
    Alert.alert(
      'Confirm Booking',
      `Book ${selectedPkg?.name} at ${lab.name}?\nPrice: ₹${selectedPkg?.price}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            Alert.alert('Success', 'Test booked successfully! Our team will contact you for sample collection.', [
              { text: 'OK', onPress: () => navigation.goBack() }
            ]);
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Lab Header */}
      <View style={styles.header}>
        <Image source={{ uri: lab.image }} style={styles.labImage} />
        <View style={styles.headerInfo}>
          <Text style={globalStyles.title}>{lab.name}</Text>
          <Text style={styles.location}>📍 {lab.location}</Text>
          <View style={styles.badges}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>NABL Certified</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Home Collection</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Test Packages */}
      <Text style={styles.sectionTitle}>Available Test Packages</Text>
      {packages.map((pkg) => (
        <TouchableOpacity
          key={pkg.id}
          style={[
            styles.packageCard,
            selectedPackage === pkg.id && styles.packageCardSelected,
          ]}
          onPress={() => setSelectedPackage(pkg.id)}
        >
          <View style={styles.packageHeader}>
            <Text style={styles.packageName}>{pkg.name}</Text>
            <Text style={styles.packagePrice}>₹{pkg.price}</Text>
          </View>
          <View style={styles.testsList}>
            {pkg.tests.map((test, index) => (
              <Text key={index} style={styles.testItem}>
                • {test}
              </Text>
            ))}
          </View>
          {selectedPackage === pkg.id && (
            <View style={styles.selectedBadge}>
              <Text style={styles.selectedText}>✓ Selected</Text>
            </View>
          )}
        </TouchableOpacity>
      ))}

      {/* Features */}
      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>Why Choose Us?</Text>
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>🏠</Text>
          <Text style={styles.featureText}>Free Home Sample Collection</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>⚡</Text>
          <Text style={styles.featureText}>Reports in 24 Hours</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>🔒</Text>
          <Text style={styles.featureText}>100% Safe & Hygienic</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>📱</Text>
          <Text style={styles.featureText}>Digital Reports via App & Email</Text>
        </View>
      </View>

      {/* Book Button */}
      <TouchableOpacity
        style={[globalStyles.button, styles.bookButton]}
        onPress={handleBookTest}
      >
        <Text style={globalStyles.buttonText}>Book Selected Test</Text>
      </TouchableOpacity>
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
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
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
  headerInfo: {
    flex: 1,
  },
  location: {
    fontSize: 14,
    color: colors.secondary,
    marginTop: 5,
  },
  badges: {
    flexDirection: 'row',
    marginTop: 10,
    flexWrap: 'wrap',
  },
  badge: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 5,
  },
  badgeText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 15,
    marginTop: 10,
  },
  packageCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  packageCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '05',
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  packageName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  packagePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  testsList: {
    marginTop: 5,
  },
  testItem: {
    fontSize: 14,
    color: colors.secondary,
    marginBottom: 3,
  },
  selectedBadge: {
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  selectedText: {
    color: colors.success,
    fontWeight: '600',
    fontSize: 14,
  },
  featuresSection: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 15,
    marginTop: 10,
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  featureText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  bookButton: {
    marginBottom: 30,
  },
});

export default LabDetailScreen;
