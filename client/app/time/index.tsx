import { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import MapPlaceholder from "../../components/MapPlaceholder";
import DateSelector from "../../components/DateSelector";
import CheckButton from "../../components/CheckButton";
import TimeDisplay from "../../components/TimeDisplay";
import ValidateButton from "../../components/ValidateButton";
import React from "react";

export default function PontajScreen() {
  const [selectedDate, setSelectedDate] = useState<number>(
    new Date().getDate()
  );
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null);
  const [isCheckInDisabled, setIsCheckInDisabled] = useState(false);
  const [isCheckOutDisabled, setIsCheckOutDisabled] = useState(true);
  const [canValidate, setCanValidate] = useState(false);

  useEffect(() => {
    // Reset times when date changes
    setCheckInTime(null);
    setCheckOutTime(null);
    setIsCheckInDisabled(false);
    setIsCheckOutDisabled(true);
    setCanValidate(false);
  }, [selectedDate]);

  const handleDateSelect = (date: number) => {
    setSelectedDate(date);
  };

  const handleCheckIn = () => {
    const now = new Date();
    const formattedTime = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;
    setCheckInTime(formattedTime);
    setIsCheckInDisabled(true);
    setIsCheckOutDisabled(false);
  };

  const handleCheckOut = () => {
    const now = new Date();
    const formattedTime = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;
    setCheckOutTime(formattedTime);
    setIsCheckOutDisabled(true);
    setCanValidate(true);
  };

  const handleValidate = () => {
    // Here you would typically send the data to a server
    alert("Time entry successfully validated");
    setCheckInTime(null);
    setCheckOutTime(null);
    setIsCheckInDisabled(false);
    setIsCheckOutDisabled(true);
    setCanValidate(false);
  };

  return (
    <ScrollView style={styles.container}>
      <MapPlaceholder />

      <DateSelector
        onDateSelect={handleDateSelect}
        initialSelectedDate={selectedDate}
      />

      <View style={styles.actionContainer}>
        <CheckButton
          label="Check-in"
          onPress={handleCheckIn}
          disabled={isCheckInDisabled}
        />

        <CheckButton
          label="Check-out"
          onPress={handleCheckOut}
          disabled={isCheckOutDisabled}
        />
      </View>

      <View style={styles.timesContainer}>
        <TimeDisplay label="Check-in" time={checkInTime} />
        <TimeDisplay label="Check-out" time={checkOutTime} />
      </View>

      <View style={styles.validateContainer}>
        <ValidateButton onPress={handleValidate} disabled={!canValidate} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  actionContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  timesContainer: {
    marginTop: 16,
  },
  validateContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#EEEEEE",
    marginTop: 16,
  },
});
