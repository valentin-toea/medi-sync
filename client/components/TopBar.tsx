import { TOP_BAR_HEIGHT } from "@/constants/Sizes";
import { router } from "expo-router";
import { Bell, LogOut } from "lucide-react-native";
import { StyleSheet, TouchableOpacity, View as RNView } from "react-native";
import { Avatar, Button, Colors, Text, View } from "react-native-ui-lib";
import { useState } from "react";
import BottomSheet from "@/components/BottomSheet"; // adjust the import path as needed
import { useAuthStore } from "@/app/store/auth.store";

export function TopBar({
  hideUser,
  hideNotifications,
}: {
  hideUser?: boolean;
  hideNotifications?: boolean;
}) {
  const userDetails = useAuthStore((state) => state.userDetails);
  const userName = `${userDetails?.lastName} ${userDetails?.firstName}`;
  const [showSheet, setShowSheet] = useState(false);

  return (
    <View style={styles.topBarWrapper}>
      <View style={styles.topBar}>
        <RNView style={styles.avatarGroup}>
          {!hideUser && (
            <TouchableOpacity
              onPress={() => setShowSheet(true)}
              style={styles.userTouchable}
            >
              <Avatar
                label={userName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
                backgroundColor={Colors.grey60}
                size={30}
              />
              <View style={styles.textContainer}>
                <Text style={styles.userName}>{userName}</Text>
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

      <BottomSheet
        visible={showSheet}
        onClose={() => setShowSheet(false)}
        title="Account"
      >
        <TouchableOpacity
          activeOpacity={0.6}
          style={styles.dropdownItem}
          onPress={() => {
            setShowSheet(false);
            router.replace("/login");
          }}
        >
          <View style={styles.logoutRow}>
            <LogOut size={16} color={Colors.red20} style={{ marginRight: 8 }} />
            <Text style={styles.dropdownText} color={Colors.red20}>
              Logout
            </Text>
          </View>
        </TouchableOpacity>
      </BottomSheet>
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
  dropdownItem: {
    paddingVertical: 12,
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
