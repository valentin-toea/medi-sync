import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { MapPin } from 'lucide-react-native';
import React from 'react';

export default function MapPlaceholder() {
  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: 'https://imgur.com/a/XDYpMjb' }} 
        style={styles.mapImage} 
      />
      <View style={styles.markerContainer}>
        <MapPin size={32} color="#4285F4" fill="#4285F4" strokeWidth={1.5} />
        <View style={styles.markerDot} />
      </View>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
    opacity: 0.7,
  },
  markerContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -16,
    marginTop: -32,
    alignItems: 'center',
  },
  markerDot: {
    width: 8,
    height: 8,
    backgroundColor: 'white',
    borderRadius: 4,
    position: 'absolute',
    top: 14,
  },
});