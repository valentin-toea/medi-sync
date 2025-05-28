import { View, Text, StyleSheet } from 'react-native';
import GuardSlot from './GuardSlot';

interface GuardDayItemProps {
  day: number;
  dayName: string;
  daySlotAvailable: boolean;
  nightSlotAvailable: boolean;
  onToggleDaySlot: () => void;
  onToggleNightSlot: () => void;
}

export default function GuardDayItem({
  day,
  dayName,
  daySlotAvailable,
  nightSlotAvailable,
  onToggleDaySlot,
  onToggleNightSlot,
}: GuardDayItemProps) {
  return (
    <View style={styles.container}>
      <View style={styles.dayContainer}>
        <Text style={styles.dayNumber}>{day}</Text>
        <Text style={styles.dayName}>{dayName}</Text>
      </View>
      
      <View style={styles.slotsContainer}>
        <GuardSlot 
          timeRange="07:00 - 19:00" 
          isAvailable={daySlotAvailable} 
          onToggle={onToggleDaySlot} 
        />
        
        <View style={styles.slotSpacer} />
        
        <GuardSlot 
          timeRange="19:00 - 07:00" 
          isAvailable={nightSlotAvailable} 
          onToggle={onToggleNightSlot} 
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