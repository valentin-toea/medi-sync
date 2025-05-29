import BottomSheet from "@/components/BottomSheet";
import { CustomCard } from "@/components/CustomCard";
import ScheduleItem from "@/components/ScheduleItem";
import { TopBar } from "@/components/TopBar";
import { useUserSchedule } from "@/hooks/useUserSchedule";
import api from "@/services/api";
import { useAuthStore } from "@/store/auth.store";
import { getScheduleStatus } from "@/utils/getScheduleStatus";
import { router } from "expo-router";
import { Clock, Loader } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import { useFocusEffect } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { Button, Colors, Text } from "react-native-ui-lib";

export default function HomeScreen() {
  const userId = 2;
  const {
    data: scheduleList,
    isLoading: isScheduleLoading,
    error,
  } = useUserSchedule(userId);
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const userDetails = useAuthStore((state) => state.userDetails);
  const [timeLogStatus, setTimeLogStatus] = useState<"not_checked_in" | "checked_in" | "checked_out">("not_checked_in");
  const [buttonLabel, setButtonLabel] = useState("Check In");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const shortScheduleList = useMemo(
    () => scheduleList?.slice(0, 3),
    [scheduleList]
  );

  const fetchTodayTimeLog = async () => {
    try {
      const todayStr = new Date().toISOString().split("T")[0];
      const res = await api.get(`/api/pontaj/${userDetails?.id ?? 1}`, {
        params: { data: todayStr },
      });
      const inregistrari = res.data.inregistrari;
      if (!inregistrari || !inregistrari.check_in) {
        setTimeLogStatus("not_checked_in");
        setButtonLabel("Check In");
        setIsButtonDisabled(false);
      } else if (inregistrari.check_in && !inregistrari.check_out) {
        setTimeLogStatus("checked_in");
        setButtonLabel("Check Out");
        setIsButtonDisabled(false);
      } else if (inregistrari.check_in && inregistrari.check_out) {
        setTimeLogStatus("checked_out");
        setButtonLabel("View Times");
        setIsButtonDisabled(false);
      }
    } catch (err) {
      setTimeLogStatus("not_checked_in");
      setButtonLabel("Check In");
      setIsButtonDisabled(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (userDetails?.id) {
      fetchTodayTimeLog();
    }
  }, [fetchTodayTimeLog, userDetails?.id]);

    useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (userDetails?.id) {
      fetchTodayTimeLog();
      interval = setInterval(fetchTodayTimeLog, 5000); // every 5 seconds
    }
    return () => clearInterval(interval);
  }, [fetchTodayTimeLog, userDetails?.id]);

  return (
    <View style={styles.container}>
      {/* Sticky Top Bar */}
      <TopBar />
      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Clock in Card */}
        <CustomCard style={{ gap: 10, display: "flex", alignItems: "center" }}>
        <View style={styles.clockContainer}>
          <Text style={styles.cardText}>Current Status</Text>
          <Text style={styles.cardSubText}>
            {timeLogStatus === "not_checked_in"
              ? "Not checked in"
              : timeLogStatus === "checked_in"
              ? "Checked in"
              : "Checked out"}
          </Text>
          <Clock size={50} />
        </View>
        <Button
          label={buttonLabel}
          backgroundColor={Colors.green20}
          borderRadius={12}
          style={{ width: "80%" }}
          onPress={() => {
            if (timeLogStatus === "not_checked_in") {
              router.push("/time"); // or trigger check-in logic
            } else if (timeLogStatus === "checked_in") {
              router.push("/time"); // or trigger check-out logic
            } else {
              // Show a modal or navigate to a screen with today's times
              router.push("/time");
            }
          }}
          disabled={isButtonDisabled}
        />
      </CustomCard>

        {/* Schedule Section */}
        <View>
          <Text style={styles.sectionTitle}>{"Today's Schedule"}</Text>
          {!isScheduleLoading ? (
            shortScheduleList?.map((item) => {
              return (
                <ScheduleItem
                  key={item.id.toString()}
                  name={item.name}
                  startTime={item.startDateTime}
                  endTime={item.endDateTime}
                  status={getScheduleStatus(
                    item.startDate,
                    item.endDate,
                    currentTime
                  )}
                />
              );
            })
          ) : (
            <Loader style={{ alignSelf: "center", margin: 12 }} />
          )}
          <Button
            label="See Full Schedule"
            outline
            outlineColor={Colors.black}
            borderRadius={12}
            onPress={() => setShowFullSchedule(true)}
          />
          <BottomSheet
            title={"Today's Schedule"}
            visible={showFullSchedule}
            onClose={() => setShowFullSchedule(false)}
          >
            {!isScheduleLoading ? (
              scheduleList?.map((item, idx) => (
                <ScheduleItem
                  key={item.id.toString()}
                  name={item.name}
                  startTime={item.startDateTime}
                  endTime={item.endDateTime}
                  status={getScheduleStatus(
                    item.startDate,
                    item.endDate,
                    currentTime
                  )}
                />
              ))
            ) : (
              <Loader style={{ alignSelf: "center", margin: 12 }} />
            )}
          </BottomSheet>
        </View>

        {/* Calendar */}
        <View>
          <Text style={styles.sectionTitle}>Monthly Rotation</Text>
          <CustomCard>
            <Calendar
              markedDates={{
                [new Date().toISOString().split("T")[0]]: {
                  selected: true,
                  marked: true,
                  selectedColor: Colors.green20,
                },
              }}
              theme={{
                backgroundColor: "transparent",
                calendarBackground: "transparent",
                textSectionTitleColor: "#4A5568",
                dayTextColor: "#1A202C",
                todayTextColor: Colors.primary,
                selectedDayBackgroundColor: Colors.primary,
                selectedDayTextColor: "#fff",
                arrowColor: Colors.primary,
                monthTextColor: "#1A202C",
              }}
            />
          </CustomCard>
        </View>

        <View>
          <Text style={styles.sectionTitle}>Time-Off</Text>
          <CustomCard style={styles.timeoffCard}>
            <View style={styles.timeoffDetails}>
              <Text>Remaining Days</Text>
              <Text style={styles.timeoffDays}>12</Text>
            </View>
            <Button
              label="Request Time-Off"
              backgroundColor={Colors.green20}
              borderRadius={12}
              onPress={() => router.push("/leave")}
            />
          </CustomCard>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 100,
    display: "flex",
    flexDirection: "column",
    gap: 28,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 12,
  },
  cardText: {
    fontSize: 16,
  },
  cardSubText: {
    fontSize: 24,
    fontWeight: 500,
    marginBottom: 8,
  },
  clockContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 12,
  },
  timeoffCard: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 30,
    paddingBottom: 30,
  },
  timeoffDetails: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  timeoffDays: {
    fontSize: 26,
    fontWeight: "500",
  },
});
