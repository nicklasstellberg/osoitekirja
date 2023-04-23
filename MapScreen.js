import React from 'react';
import { View, Text } from 'react-native';

const MapScreen = ({ route }) => {
  const { address } = route.params;
  return (
    <View>
      <Text>{address}</Text>
    </View>
  );
}

export default MapScreen;