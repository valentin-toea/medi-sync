import { CustomCard } from "@/components/CustomCard";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Colors } from "react-native-ui-lib";

const notifications = [
  {
    id: "1",
    title: "Appointment Reminder",
    message: "You have an appointment tomorrow at 9:00 AM.",
  },
  {
    id: "2",
    title: "New Message",
    message: "Dr. Smith sent you a message regarding your last checkup.",
  },
  {
    id: "3",
    title: "Lab Results Ready",
    message: "Your recent blood test results are now available.",
  },
];

export default function NotificationScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <CustomCard style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.message}>{item.message}</Text>
          </CustomCard>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 0,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 32,
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 24,
  },
  card: {
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    color: Colors.text,
  },
  message: {
    fontSize: 14,
    color: Colors.grey30,
  },
  separator: {
    height: 12,
  },
});
