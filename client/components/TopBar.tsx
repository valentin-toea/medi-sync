import { TOP_BAR_HEIGHT } from "@/constants/Sizes";
import { router } from "expo-router";
import { Bell } from "lucide-react-native";
import { StyleSheet } from "react-native";
import { Avatar, Button, Colors, Text, View } from "react-native-ui-lib";

export function TopBar({
  hideUser,
  hideNotifications,
}: {
  hideUser?: boolean;
  hideNotifications?: boolean;
}) {
  const user = { name: "Dr. Test User" };

  return (
    <View style={styles.topBarWrapper}>
      <View style={styles.topBar}>
        <View style={styles.avatarGroup}>
          {!hideUser && (
            <>
              <Avatar
                label={user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
                backgroundColor={Colors.grey60}
                size={30}
              />
              <View style={styles.textContainer}>
                <Text style={styles.userName}>{user.name}</Text>
              </View>
            </>
          )}
        </View>
        {!hideNotifications && (
          <Button
            iconSource={() => <Bell size={20} color={Colors.grey30} />}
            backgroundColor={Colors.transparent}
            style={{ padding: 4 }}
            onPress={() => router.push("/notifications")}
          />
        )}
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey60,
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
    fontWeight: "500",
  },
});
