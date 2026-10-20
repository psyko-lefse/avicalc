import { QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LogBox, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";

import { ErrorBoundary } from "@/src/components/error-boundary";
import { fontAssets } from "@/src/fonts";
import { queryClient } from "@/src/query-client";
import { SettingsProvider } from "@/src/settings";
import { useTheme } from "@/src/theme";

// Disable logbox errors etc so that users can see the app
// and agent works as expected.
LogBox.ignoreAllLogs(true)

export default function RootLayout() {
  const { colors, scheme } = useTheme();
  const [fontsLoaded, fontError] = useFonts(fontAssets);
  if (!fontsLoaded && !fontError) return null;
  return (
    <GestureHandlerRootView style={styles.root}>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <KeyboardProvider>
            <SettingsProvider>
              <StatusBar style={scheme === "dark" ? "light" : "dark"} />
              <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.surface } }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="settings" options={{ presentation: "modal" }} />
              </Stack>
            </SettingsProvider>
          </KeyboardProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
