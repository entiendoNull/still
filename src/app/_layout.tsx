import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { setToolsButtonVisible } from "expo-dev-client";
import { Stack, DarkTheme, ThemeProvider } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function Layout() {
  useEffect(() => {
    if (__DEV__) {
      setToolsButtonVisible(false);
    }
  }, []);

  return (
    <ThemeProvider value={DarkTheme}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: styles.background,
          headerTintColor: "#F1F4E8",
          contentStyle: styles.background,
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="index" options={{ title: "Still" }} />
      </Stack>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#101A18",
  },
});
