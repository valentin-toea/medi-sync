import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Check } from 'lucide-react-native';

interface GuardSlotProps {
  timeRange: string;
  isAvailable: boolean;
  onToggle: () => void;
}

export default function GuardSlot({ timeRange, isAvailable, onToggle }: GuardSlotProps) {
  return (
    <View style={styles.container}>
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{timeRange}</Text>
      </View>
      <TouchableOpacity 
        style={[styles.checkbox, isAvailable && styles.checkboxSelected]} 
        onPress={onToggle}
      >
        {isAvailable && <Check size={16} color="white" />}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 16,
  },
  timeContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flex: 1,
    marginRight: 12,
  },
  timeText: {
    textAlign: 'center',
    color: '#555',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  checkboxSelected: {
    backgroundColor: '#4285F4',
    borderColor: '#4285F4',
  },
});