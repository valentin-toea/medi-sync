import React from "react";
import { Calendar } from "react-native-calendars";
import { ScrollView, StyleSheet, View } from "react-native";
import { Avatar, Button, Card, Colors, Text } from "react-native-ui-lib";
import { Bell } from "lucide-react-native";
import { TOP_BAR_HEIGHT } from "@/constants/Sizes";
import ScheduleItem from "@/components/ScheduleItem";

export default function HomeScreen() {
  const user = { name: "Test User" };

  return (
    <View style={styles.container}>
      {/* Sticky Top Bar */}
      <View style={styles.topBarWrapper}>
        <View style={styles.topBar}>
          <View style={styles.avatarGroup}>
            <Avatar
              label={user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
              backgroundColor={Colors.grey60}
              size={40}
            />
            <Text style={styles.userName}>{user.name}</Text>
          </View>
          <Button
            iconSource={() => <Bell size={20} color={Colors.grey30} />}
            backgroundColor={Colors.transparent}
            style={{ padding: 4 }}
          />
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Clock in Card */}
        <Card style={{ ...styles.card, gap: 10 }}>
          <Text style={styles.cardText}>Clocked out</Text>
          <Button
            label="Clock In"
            backgroundColor={Colors.green20}
            borderRadius={12}
          />
          <Button
            label="Clock Out"
            backgroundColor={Colors.red10}
            borderRadius={12}
          />
        </Card>

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
          />
        </View>

        {/* Calendar */}
        <View>
          <Text style={styles.sectionTitle}>Monthly Rotation</Text>
          <Card style={styles.card}>
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
          </Card>
        </View>

        <View>
          <Text style={styles.sectionTitle}>Time-Off</Text>
          <Card style={{ ...styles.card, ...styles.timeoffCard }}>
            <View style={styles.timeoffDetails}>
              <Text>Remaining Days</Text>
              <Text style={styles.timeoffDays}>12</Text>
            </View>
            <Button
              label="Request Time-Off"
              backgroundColor={Colors.green20}
              borderRadius={12}
            />
          </Card>
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
  topBarWrapper: {
    height: TOP_BAR_HEIGHT,
    justifyContent: "center",
    backgroundColor: Colors.white,
    zIndex: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  avatarGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  userName: {
    fontSize: 16,
    marginLeft: 12,
    color: Colors.text,
    fontWeight: "600",
  },
  scrollContent: {
    paddingTop: 24,
    paddingHorizontal: 24,
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
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.white,
    elevation: 2,
  },
  cardText: {
    fontSize: 16,
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
