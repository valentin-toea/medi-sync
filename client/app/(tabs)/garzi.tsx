import { View, StyleSheet, FlatList } from "react-native";
import Header from "../../components/Header";
import HospitalInfo from "../../components/HospitalInfo";
import MonthSelector from "../../components/MonthSelector";
import GuardDayItem from "../../components/GuardDayItem";
import { useState } from "react";
import React from "react";
import { Text } from "react-native-ui-lib";

interface GuardDay {
  id: string;
  day: number;
  dayName: string;
  dayOfWeek: string;
  daySlotAvailable: boolean;
  nightSlotAvailable: boolean;
}

export default function TimesheetScreen() {
  const [month, setMonth] = useState<number>(new Date().getMonth());
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [guardDays, setGuardDays] = useState<GuardDay[]>(
    generateGuardDaysForMonth(month, year)
  );

  const handleMonthChange = (newMonth: number, newYear: number) => {
    setMonth(newMonth);
    setYear(newYear);
    setGuardDays(generateGuardDaysForMonth(newMonth, newYear));
  };

  const toggleDaySlot = (id: string) => {
    setGuardDays(
      guardDays.map((day) =>
        day.id === id
          ? { ...day, daySlotAvailable: !day.daySlotAvailable }
          : day
      )
    );
  };

  const toggleNightSlot = (id: string) => {
    setGuardDays(
      guardDays.map((day) =>
        day.id === id
          ? { ...day, nightSlotAvailable: !day.nightSlotAvailable }
          : day
      )
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Duty</Text>
      <HospitalInfo name="University Hospital" />
      <MonthSelector onMonthChange={handleMonthChange} />

      <View style={styles.divider} />

      <FlatList
        data={guardDays}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <GuardDayItem
            day={item.day}
            dayName={item.dayName}
            daySlotAvailable={item.daySlotAvailable}
            nightSlotAvailable={item.nightSlotAvailable}
            onToggleDaySlot={() => toggleDaySlot(item.id)}
            onToggleNightSlot={() => toggleNightSlot(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

// Helper function to generate guard days for a given month and year
function generateGuardDaysForMonth(month: number, year: number): GuardDay[] {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: GuardDay[] = [];

  const dayNames = [
    "Sunday",
    "Mondey",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const shortDayNames = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];

  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    const dayOfWeek = date.getDay();

    days.push({
      id: `${year}-${month + 1}-${i}`,
      day: i,
      dayName: dayNames[dayOfWeek],
      dayOfWeek: shortDayNames[dayOfWeek],
      daySlotAvailable: Math.random() > 0.7, // Random initial state for demo
      nightSlotAvailable: Math.random() > 0.7, // Random initial state for demo
    });
  }

  return days;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
    marginTop: 20,
    paddingHorizontal: 20,
  },
  divider: {
    height: 1,
    backgroundColor: "#EEEEEE",
    marginVertical: 8,
  },
  listContent: {
    paddingBottom: 100,
    paddingHorizontal: 20,
  },
});
