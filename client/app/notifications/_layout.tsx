import { HeaderBackButton } from "@react-navigation/elements";
import { router, Stack } from "expo-router";

export default function NotificationsLayout() {
  return (
    <Stack
      screenOptions={{
        title: "Notifications",
        headerTitleAlign: "center",
        headerLeft: () => (
          <HeaderBackButton
            onPress={() => router.back()}
            tintColor="#0a7ea4"
            label="Back"
          />
        ),
      }}
    />
  );
}
