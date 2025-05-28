// components/MapPlaceholder.tsx
import React from 'react';
import { StyleSheet, View, Dimensions, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import useLocation from '@/hooks/useLocation';

const { width } = Dimensions.get('window');

export default function MapPlaceholder() {
  const coords = useLocation();

  if (!coords) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <MapView
      style={styles.map}
      initialRegion={{
        ...coords,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
    >
      <Marker coordinate={coords} />
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  loader: {
    width: '100%',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
