import { TOP_BAR_HEIGHT } from "@/constants/Sizes";
import { router } from "expo-router";
import { Bell, LogOut } from "lucide-react-native";
import { StyleSheet, TouchableOpacity, View as RNView } from "react-native";
import { Avatar, Button, Colors, Modal, Text, View } from "react-native-ui-lib";
import { useEffect, useRef, useState } from "react";

export function TopBar({
  hideUser,
  hideNotifications,
}: {
  hideUser?: boolean;
  hideNotifications?: boolean;
}) {
  const user = { name: "Dr. Test User" };
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownCoords, setDropdownCoords] = useState({ x: 0, y: 0 });

  const avatarGroupRef = useRef<RNView>(null);

  const openDropdown = () => {
    avatarGroupRef.current?.measureInWindow((x, y, _, height) => {
      setDropdownCoords({ x, y: y + height + 5 });
      setShowDropdown(true);
    });
  };

  const closeDropdown = () => setShowDropdown(false);

  useEffect(() => {
    return () => closeDropdown();
  }, []);

  return (
    <View style={styles.topBarWrapper}>
      <View style={styles.topBar}>
        <RNView style={styles.avatarGroup} ref={avatarGroupRef}>
          {!hideUser && (
            <TouchableOpacity
              onPress={openDropdown}
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
        </RNView>

        {!hideNotifications && (
          <Button
            iconSource={() => <Bell size={20} color={Colors.grey30} />}
            backgroundColor={Colors.transparent}
            style={{ padding: 4 }}
            onPress={() => router.push("/notifications")}
          />
        )}
      </View>

      <Modal
        visible={showDropdown}
        onBackgroundPress={closeDropdown}
        transparent
        overlayBackgroundColor="transparent"
        animationType="fade"
      >
        <View
          style={[
            styles.dropdownWrapper,
            { top: dropdownCoords.y, left: dropdownCoords.x },
          ]}
        >
          <View style={styles.dropdown}>
            <TouchableOpacity
              activeOpacity={0.6}
              style={styles.dropdownItem}
              onPress={() => {
                router.replace("/login");
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
        </View>
      </Modal>
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
    paddingHorizontal: 20,
  },
  avatarGroup: {
    flexDirection: "row",
    alignItems: "center",
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
  dropdownWrapper: {
    position: "absolute",
    zIndex: 99,
  },
  dropdown: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
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
