import { View, Text, StyleSheet } from 'react-native';
import GuardSlot from './GuardSlot';

interface GuardDayItemProps {
  day: number;
  dayName: string;
  daySlotAvailable: boolean;
  onToggleDaySlot: () => void;
  disabled?: boolean;
}

export default function GuardDayItem({
  day,
  dayName,
  daySlotAvailable,
  onToggleDaySlot,
  disabled = false, // <-- add default
}: GuardDayItemProps) {
  return (
    <View style={styles.container}>
      <View style={styles.dayContainer}>
        <Text style={styles.dayNumber}>{day}</Text>
        <Text style={styles.dayName}>{dayName}</Text>
      </View>
      
      <View style={styles.slotsContainer}>
        <GuardSlot 
          timeRange="00:00 - 23:59" 
          isAvailable={daySlotAvailable} 
          onToggle={disabled ? () => {} : onToggleDaySlot} // <-- disable toggle
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dayContainer: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: '600',
  },
  dayName: {
    fontSize: 12,
    color: '#666',
  },
  slotsContainer: {
    flex: 1,
  },
  slotSpacer: {
    height: 8,
  },
});