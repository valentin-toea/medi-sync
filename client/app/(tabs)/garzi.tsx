import { View, StyleSheet, FlatList } from "react-native";
import Header from "../../components/Header";
import HospitalInfo from "../../components/HospitalInfo";
import MonthSelector from "../../components/MonthSelector";
import GuardDayItem from "../../components/GuardDayItem";
import { useState } from "react";
import React from "react";
import { useAuthStore } from "@/store/auth.store";
import api from "@/services/api";
import { useEffect } from "react";
import { Alert } from "react-native";
import { Text } from "react-native-ui-lib";

interface GuardDay {
  id: string;
  day: number;
  dayName: string;
  dayOfWeek: string;
  daySlotAvailable: boolean;
}

export default function TimesheetScreen() {
  const [month, setMonth] = useState<number>(new Date().getMonth());
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [guardDays, setGuardDays] = useState<GuardDay[]>(
    generateGuardDaysForMonth(month, year)
  );
  const [assignedDays, setAssignedDays] = useState<string[]>([]);
  const userDetails = useAuthStore((state) => state.userDetails);
  
  useEffect(() => {
    async function fetchAssignedDays() {
      const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
      try {
        const res = await api.get(`/api/garda/my-days?month=${monthStr}`);
        setAssignedDays(res.data.days); // e.g. ["2025-06-01", ...]
      } catch (err) {
        console.log("Error fetching assigned days:", err);
      }
    }
    fetchAssignedDays();
  }, [month, year]);

    const handleAssign = (dateStr: string) => {
      Alert.alert(
        "Confirm Assignment",
        `Assign yourself to guard on ${dateStr}?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Yes",
            onPress: async () => {
              await api.post("/api/garda/auto-assign", {
                userId: userDetails?.id ?? 1,
                date: dateStr,
              });
              // Refresh assigned days
              const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
              const res = await api.get(`/api/garda/my-days?month=${monthStr}`);
              setAssignedDays(res.data.days);
            },
          },
        ]
      );
    };

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Duty</Text>
      <HospitalInfo name="University Hospital" />
      <MonthSelector onMonthChange={handleMonthChange} />

      <View style={styles.divider} />

      <FlatList
        data={guardDays}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(item.day).padStart(2, '0')}`;
          const isAssigned = assignedDays.includes(dateStr);
      
          return (
            <GuardDayItem
              day={item.day}
              dayName={item.dayName}
              daySlotAvailable={isAssigned} // checked if assigned
              onToggleDaySlot={() => {
                if (!isAssigned) handleAssign(dateStr);
              }}
              disabled={isAssigned}
            />
          );
        }}
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
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
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
      daySlotAvailable: false, // always false, will be set in render
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
