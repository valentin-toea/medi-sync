import { TOP_BAR_HEIGHT } from "@/constants/Sizes";
import { router } from "expo-router";
import { Bell, LogOut } from "lucide-react-native";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Avatar, Button, Colors, Text, View } from "react-native-ui-lib";
import { useState } from "react";

export function TopBar({
  hideUser,
  hideNotifications,
}: {
  hideUser?: boolean;
  hideNotifications?: boolean;
}) {
  const user = { name: "Dr. Test User" };
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => setShowDropdown((prev) => !prev);
  const closeDropdown = () => setShowDropdown(false);

  return (
    <View style={styles.topBarWrapper}>
      <View style={styles.topBar}>
        <View style={styles.avatarGroup}>
          {!hideUser && (
            <TouchableOpacity
              onPress={toggleDropdown}
              style={styles.userTouchable}
            >
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
            </TouchableOpacity>
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

      {showDropdown && (
        <View style={styles.dropdown}>
          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.dropdownItem}
            onPress={() => {
              closeDropdown();
              router.navigate("/login");
            }}
          >
            <View style={styles.logoutRow}>
              <LogOut
                size={16}
                color={Colors.red20}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.dropdownText} color={Colors.red20}>
                Logout
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  topBarWrapper: {
    backgroundColor: Colors.white,
    zIndex: 10,
    elevation: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey60,
  },
  topBar: {
    height: TOP_BAR_HEIGHT,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  avatarGroup: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  userTouchable: {
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: "500",
  },
  dropdown: {
    position: "absolute",
    top: TOP_BAR_HEIGHT + 2,
    left: 24,
    backgroundColor: Colors.white,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 20,
    minWidth: 160,
  },
  dropdownItem: {
    paddingVertical: 10,
  },
  dropdownText: {
    fontSize: 16,
    fontWeight: "500",
  },
  logoutRow: {
    flexDirection: "row",
    alignItems: "center",
  },
});
