import { HeaderBackButton } from "@react-navigation/elements";
import { router, Stack } from "expo-router";
import { Colors } from "react-native-ui-lib";

export default function NotificationsLayout() {
  return (
    <Stack
      screenOptions={{
        title: "Notifications",
        headerTitleAlign: "center",
        headerLeft: () => (
          <HeaderBackButton
            onPress={() => router.back()}
            tintColor={Colors.green20}
            label="Back"
          />
        ),
      }}
    />
  );
}
