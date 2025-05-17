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

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
        <Stack screenOptions={{ headerShown: false }} />
        <StatusBar style="auto" />
      </SafeAreaView>
    </ThemeProvider>
  );
}
