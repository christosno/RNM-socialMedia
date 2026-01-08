import "../../global.css";

import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { ThemeProvider, DefaultTheme } from "@react-navigation/native";
import { AuthProvider, useAuth } from "../providers/AuthProvider";
import {
  ActivityIndicator,
  AppState,
  AppStateStatus,
  Platform,
} from "react-native";
import {
  QueryClient,
  QueryClientProvider,
  focusManager,
  onlineManager,
} from "@tanstack/react-query";
import { useReactQueryDevTools } from "@dev-plugins/react-query";
import NetInfo from "@react-native-community/netinfo";

const queryClient = new QueryClient();

onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    setOnline(!!state.isConnected);
  });
});

const CustomTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#e0f2fe",
    primary: "#0c4a6e",
  },
};

function RootLayoutNav() {
  useReactQueryDevTools(queryClient);
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  return (
    <ThemeProvider value={CustomTheme}>
      <Stack>
        <Stack.Protected guard={!!session}>
          <Stack.Screen
            name="(protected)"
            options={{
              headerShown: false,
            }}
          />
        </Stack.Protected>
        <Stack.Protected guard={!session}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack.Protected>
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  useEffect(() => {
    const subscription = AppState.addEventListener("change", onAppStateChange);
    return () => subscription.remove();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </QueryClientProvider>
  );
}

function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active");
  }
}
