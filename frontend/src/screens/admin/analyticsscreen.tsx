import React from 'react';
import { View, Text } from 'react-native';
import { globalStyles } from '../../styles/globalstyle';

const AnalyticsScreen: React.FC = () => {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Analytics</Text>
      <Text style={globalStyles.body}>Analytics data will be displayed here.</Text>
    </View>
  );
};

export default AnalyticsScreen;