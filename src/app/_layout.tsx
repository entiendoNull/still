import { useEffect } from "react";
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
          headerStyle: { backgroundColor: "#101A18" },
          headerTintColor: "#F1F4E8",
          contentStyle: { backgroundColor: "#101A18" },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="index" options={{ title: "Still" }} />
      </Stack>
    </ThemeProvider>
  );
}
