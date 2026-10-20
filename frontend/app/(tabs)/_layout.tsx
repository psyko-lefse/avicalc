import Feather from "@react-native-vector-icons/feather";
import { Tabs } from "expo-router";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import { ColorValue, Platform } from "react-native";

import { select } from "@/src/haptics";
import { usesNativeTabs } from "@/src/navigation";
import { useTheme } from "@/src/theme";
import { fonts } from "@/src/fonts";

export default function TabsLayout() {
  const { colors } = useTheme();

  if (usesNativeTabs) {
    return (
      <NativeTabs tintColor={colors.brandPrimary}>
        <NativeTabs.Trigger name="fuel">
          <NativeTabs.Trigger.Icon sf="fuelpump.fill" />
          <NativeTabs.Trigger.Label>Fuel</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="torque">
          <NativeTabs.Trigger.Icon sf="wrench.adjustable.fill" />
          <NativeTabs.Trigger.Label>Torque</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="time">
          <NativeTabs.Trigger.Icon sf="clock.fill" />
          <NativeTabs.Trigger.Label>Time</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="mel">
          <NativeTabs.Trigger.Icon sf="calendar" />
          <NativeTabs.Trigger.Label>MEL</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
      </NativeTabs>
    );
  }

  const icon = (name: string) =>
    function TabIcon({ color }: { color: ColorValue }) {
      return <Feather name={name as any} size={22} color={color as string} />;
    };

  return (
    <Tabs
      screenListeners={{ tabPress: () => select() }}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.brandPrimary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.surfaceSecondary,
          borderTopColor: colors.border,
          ...(Platform.OS === "web" ? { height: 64 } : {}),
        },
        tabBarItemStyle: { alignSelf: "center" },
        tabBarLabelStyle: { fontSize: 12, fontFamily: fonts.semibold },
      }}
    >
      <Tabs.Screen name="fuel" options={{ title: "Fuel", tabBarIcon: icon("droplet"), tabBarButtonTestID: "tab-fuel" }} />
      <Tabs.Screen name="torque" options={{ title: "Torque", tabBarIcon: icon("tool"), tabBarButtonTestID: "tab-torque" }} />
      <Tabs.Screen name="time" options={{ title: "Time", tabBarIcon: icon("clock"), tabBarButtonTestID: "tab-time" }} />
      <Tabs.Screen name="mel" options={{ title: "MEL", tabBarIcon: icon("calendar"), tabBarButtonTestID: "tab-mel" }} />
    </Tabs>
  );
}
