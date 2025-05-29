import { CustomCard } from "@/components/CustomCard";
import { useNotificationsStore } from "@/store/notification.store";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "react-native-ui-lib";

export default function NotificationScreen() {
  const notifications = useNotificationsStore((state) => state.notifications);
  const error = useNotificationsStore((state) => state.error);
  const markAsRead = useNotificationsStore((state) => state.markAsRead);

  if (error)
    return (
      <View>
        <Text>{error}</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => markAsRead(item.id)}>
            <CustomCard>
              <Text style={styles.title}>{item.titlu}</Text>
              <Text style={styles.message}>{item.mesaj}</Text>
              <Text
                style={{
                  ...styles.message,
                  alignSelf: "flex-end",
                  color: "black",
                  marginTop: 5,
                }}
              >{`${item.data_trimitere.split("T")[1].split(".")[0] ?? ""} -  ${
                item.data_trimitere.split("T")[0]
              }`}</Text>
              <Text
                style={{
                  ...styles.message,
                  color: item.citit ? Colors.grey30 : Colors.green30,
                }}
              >
                {item.citit ? "Read" : "New"}
              </Text>
            </CustomCard>
          </TouchableOpacity>
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
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 24,
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
    height: 8,
  },
});
