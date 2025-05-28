import { View, Text, StyleSheet } from 'react-native';
import { MapPin } from 'lucide-react-native';

interface HospitalInfoProps {
  name: string;
}

export default function HospitalInfo({ name }: HospitalInfoProps) {
  return (
    <View style={styles.container}>
      <MapPin size={16} color="#333" />
      <Text style={styles.name}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  name: {
    fontSize: 14,
    marginLeft: 8,
    color: '#333',
  },
});