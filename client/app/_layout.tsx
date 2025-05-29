import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors, Typography, Spacings } from "react-native-ui-lib";
import { SafeAreaView } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useNotificationsStore } from "@/store/notification.store";
import { useEffect } from "react";

Colors.loadColors({
  primary: "#0a7ea4",
  background: "#ffffff",
  text: "#11181C",
  gray: "#687076",
});

Typography.loadTypographies({
  heading: { fontSize: 24, fontWeight: "700" },
  body: { fontSize: 16 },
});

Spacings.loadSpacings({
  page: 24,
  card: 16,
});

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const fetchNotifications = useNotificationsStore(
    (state) => state.fetchNotifications
  );
  const startNotificationPolling = useNotificationsStore(
    (state) => state.startPolling
  );
  const stopNotificationPolling = useNotificationsStore(
    (state) => state.stopPolling
  );

  useEffect(() => {
    fetchNotifications();
    startNotificationPolling();
    return () => stopNotificationPolling();
  }, [fetchNotifications, startNotificationPolling, stopNotificationPolling]);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
          <Stack screenOptions={{ headerShown: false }} />
          <StatusBar style="auto" />
        </SafeAreaView>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
