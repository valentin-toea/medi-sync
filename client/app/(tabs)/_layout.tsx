import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { HapticTab } from "@/components/HapticTab"; // Assuming HapticTab is your custom tab button component
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors"; // Assuming Colors is correctly set up
import { useColorScheme } from "@/hooks/useColorScheme";
import { ClipboardPlus } from "lucide-react-native";
import { useAuthStore } from "@/store/auth.store";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const userDetails = useAuthStore((state) => state.userDetails);
  const isAdmin = userDetails?.role === "admin";

  // Determine the active tint color safely
  const activeTintColor = Colors[colorScheme ?? "light"]?.tint ?? Colors["light"].tint;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeTintColor,
        headerShown: false,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
          tabBarButton: HapticTab,
        }}
      />
      <Tabs.Screen
        name="garzi"
        options={{
          title: "Duty",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="calendar" color={color} />
          ),
          tabBarButton: HapticTab,
        }}
      />
      <Tabs.Screen
        name="residency"
        options={{
          title: "Residency",
          tabBarIcon: ({ color }) => <ClipboardPlus size={28} color={color} />,
          tabBarButton: HapticTab,
        }}
      />
      <Tabs.Screen
        name="leave"
        options={{
          title: "Leave",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="calendar" color={color} />
          ),
          tabBarButton: HapticTab,
        }}
      />
      <Tabs.Screen
        name="admin" // Admin tab is always in the JSX structure
        options={{
          title: "Admin",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="paperplane.fill" color={color} />
          ),
          // Conditionally hide the button rendering
          tabBarButton: isAdmin ? HapticTab : () => null,
          // Conditionally set tabBarItemStyle to collapse the space
          tabBarItemStyle: isAdmin ? undefined : { display: 'none' },
        }}
      />
    </Tabs>
  );
}
