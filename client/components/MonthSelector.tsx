import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useState } from 'react';

interface MonthSelectorProps {
  onMonthChange: (month: number, year: number) => void;
}

export default function MonthSelector({ onMonthChange }: MonthSelectorProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
    onMonthChange(newDate.getMonth(), newDate.getFullYear());
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
    onMonthChange(newDate.getMonth(), newDate.getFullYear());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {months[currentDate.getMonth()]} {currentDate.getFullYear()}
      </Text>
      <View style={styles.navigation}>
        <TouchableOpacity onPress={goToPreviousMonth} style={styles.navButton}>
          <ChevronLeft size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={goToNextMonth} style={styles.navButton}>
          <ChevronRight size={24} color="#333" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  navigation: {
    flexDirection: 'row',
  },
  navButton: {
    padding: 8,
  },
});