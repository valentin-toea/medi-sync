import React, { useState } from "react";
import { Calendar } from "react-native-calendars";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Colors, Text } from "react-native-ui-lib";
import ScheduleItem from "@/components/ScheduleItem";
import { TopBar } from "@/components/TopBar";
import BottomSheet from "@/components/BottomSheet";
import { CustomCard } from "@/components/CustomCard";

export default function HomeScreen() {
  const [showFullSchedule, setShowFullSchedule] = useState(false);

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
            <Text style={styles.cardSubText}>Clocked out</Text>
          </View>
          <Button
            label="Clock In"
            backgroundColor={Colors.green20}
            borderRadius={12}
            style={{ width: "80%" }}
          />
          {/* <Button
            label="Clock Out"
            backgroundColor={Colors.red10}
            borderRadius={12}
          /> */}
        </CustomCard>

        {/* Schedule Section */}
        <View>
          <Text style={styles.sectionTitle}>{"Today's Schedule"}</Text>
          {[1, 2, 3].map((item, idx) => (
            <ScheduleItem
              key={idx}
              name={"Task Example"}
              startTime={"7:00 AM"}
              endTime={"10:00 AM"}
            />
          ))}
          <Button
            label="See all"
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
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, idx) => (
              <ScheduleItem
                key={idx}
                name={"Task Example"}
                startTime={"7:00 AM"}
                endTime={"10:00 AM"}
              />
            ))}
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
    marginBottom: 12,
  },
  cardSubText: {
    fontSize: 20,
    fontWeight: 500,
  },
  clockContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 20,
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
