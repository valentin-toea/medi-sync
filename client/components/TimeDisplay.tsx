import { View, Text, StyleSheet } from 'react-native';

interface TimeDisplayProps {
  label: string;
  time: string | null;
}

export default function TimeDisplay({ label, time }: TimeDisplayProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.time}>{time || '--:--'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
  time: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4285F4',
  },
});