import { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import MapPlaceholder from "../../components/MapPlaceholder";
import DateSelector from "../../components/DateSelector";
import CheckButton from "../../components/CheckButton";
import TimeDisplay from "../../components/TimeDisplay";
import ValidateButton from "../../components/ValidateButton";
import React from "react";
import api from "@/services/api";
import { useAuthStore } from "@/store/auth.store";
import useLocation from "@/hooks/useLocation";

export default function PontajScreen() {
  const [selectedDate, setSelectedDate] = useState<number>(
    new Date().getDate()
  );
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null);
  const [isCheckInDisabled, setIsCheckInDisabled] = useState(false);
  const [isCheckOutDisabled, setIsCheckOutDisabled] = useState(false);
  const [canValidate, setCanValidate] = useState(false);
  const coords = useLocation();
  const today = new Date();
  const isToday = selectedDate === today.getDate();

  const userDetails = useAuthStore((state) => state.userDetails);

  useEffect(() => {
    const fetchTimeLog = async () => {
      if (!userDetails?.id) return;
      const dateStr = new Date(today.getFullYear(), today.getMonth(), selectedDate);
      try {
        const res = await api.get(`/api/pontaj/${userDetails.id}`, {
          params: { data: dateStr },
        });
        const inregistrari = res.data.inregistrari;

        setCheckInTime(inregistrari?.check_in ? new Date(inregistrari.check_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null);
        setCheckOutTime(inregistrari?.check_out ? new Date(inregistrari.check_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null);
        setIsCheckInDisabled(!!inregistrari?.check_in);
        setIsCheckOutDisabled(!inregistrari?.check_in || !!inregistrari?.check_out);
        setCanValidate(!!inregistrari?.check_in && !!inregistrari?.check_out);
      } catch (err) {
        setCheckInTime(null);
        setCheckOutTime(null);
        setIsCheckInDisabled(false);
        setIsCheckOutDisabled(true);
        setCanValidate(false);
      }
    };
    fetchTimeLog();
  }, [userDetails?.id, selectedDate]);

  const handleDateSelect = (date: number) => {
    setSelectedDate(date);
  };

  const handleCheckIn = async () => {
    const now = new Date();
    const isoString = now.toISOString();
    try {
      await api.post("api/pontaj/checkin", {
        userId: userDetails?.id,
        checkInTime: isoString,
        gpsLocationCheckIn: coords
          ? `${coords.latitude},${coords.longitude}`
          : "unknown",
        date: isoString.split("T")[0],
      });
      setCheckInTime(`${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`);
      setIsCheckInDisabled(true);
      setIsCheckOutDisabled(false);
    } catch (err) {
      alert("Check-in failed");
    }
  };
  
  const handleCheckOut = async () => {
    const now = new Date();
    const isoString = now.toISOString();
    try {
      await api.post("api/pontaj/checkout", {
        userId: userDetails?.id,
        checkOutTime: isoString,
        gpsLocationCheckOut: coords
          ? `${coords.latitude},${coords.longitude}`
          : "unknown",
      });
      setCheckOutTime(`${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`);
      setIsCheckOutDisabled(true);
      setCanValidate(true);
    } catch (err) {
      alert("Check-out failed");
    }
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
        disabled={isCheckInDisabled || !isToday}
      />
      <CheckButton
        label="Check-out"
        onPress={handleCheckOut}
        disabled={isCheckOutDisabled || !isToday}
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
