import { TOP_BAR_HEIGHT } from "@/constants/Sizes";
import { router } from "expo-router";
import { Bell } from "lucide-react-native";
import { StyleSheet } from "react-native";
import { Avatar, Button, Colors, Text, View } from "react-native-ui-lib";

export function TopBar() {
  const user = { name: "Test User", title: "Doctor" };

  return (
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
          <View style={styles.textContainer}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text>{user.title}</Text>
          </View>
        </View>
        <Button
          iconSource={() => <Bell size={20} color={Colors.grey30} />}
          backgroundColor={Colors.transparent}
          style={{ padding: 4 }}
          onPress={() => router.push("/notifications")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  textContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: "600",
  },
});
