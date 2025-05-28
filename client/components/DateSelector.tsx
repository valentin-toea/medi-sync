import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useState, useRef, useEffect } from 'react';

interface DateItem {
  date: number;
  day: string;
  month?: string;
  isSelected: boolean;
}

interface DateSelectorProps {
  onDateSelect: (date: number) => void;
  initialSelectedDate?: number;
}

export default function DateSelector({ onDateSelect, initialSelectedDate }: DateSelectorProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const today = new Date();
  const currentDate = today.getDate();

  const getDates = (): DateItem[] => {
    const days = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
    const dates: DateItem[] = [];
    
    for (let i = -3; i <= 3; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      dates.push({
        date: date.getDate(),
        day: days[date.getDay()],
        isSelected: initialSelectedDate ? initialSelectedDate === date.getDate() : i === 0,
      });
    }
    
    return dates;
  };

  const [dates, setDates] = useState<DateItem[]>(getDates());

  const handleDateSelect = (selectedDate: number) => {
    const updatedDates = dates.map(item => ({
      ...item,
      isSelected: item.date === selectedDate,
    }));
    
    setDates(updatedDates);
    onDateSelect(selectedDate);
  };

  useEffect(() => {
    // Scroll to center (today) when component mounts
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: 120, animated: false });
    }
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {dates.map((item) => (
          <TouchableOpacity
            key={item.date}
            style={[
              styles.dateItem,
              item.isSelected && styles.selectedDateItem,
            ]}
            onPress={() => handleDateSelect(item.date)}
          >
            <Text style={styles.dayText}>{item.day}</Text>
            <Text
              style={[
                styles.dateText,
                item.isSelected && styles.selectedDateText,
              ]}
            >
              {item.date}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  scrollContent: {
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  dateItem: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    width: 40,
    height: 60,
    borderRadius: 20,
  },
  selectedDateItem: {
    backgroundColor: '#4285F4',
  },
  dayText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
  },
  selectedDateText: {
    color: 'white',
  },
});