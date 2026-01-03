import "../../global.css";

import React from "react";
import { Stack } from "expo-router";
import { ThemeProvider, DefaultTheme } from "@react-navigation/native";
import { AuthProvider, useAuth } from "../providers/AuthProvider";
import { ActivityIndicator } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useReactQueryDevTools } from '@dev-plugins/react-query';

const queryClient = new QueryClient();

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
  return (
    <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
    </QueryClientProvider>
  );
}
