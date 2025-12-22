import "../../global.css";

import React from "react";
import { Stack } from "expo-router";
import { ThemeProvider, DefaultTheme } from "@react-navigation/native";

const CustomTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#e0f2fe",
    primary: "#0c4a6e",
  },
};

export default function RootLayout() {
  return (
    <ThemeProvider value={CustomTheme}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "Feed",
            headerStyle: { backgroundColor: "#bfdbfe" },
          }}
        />
        <Stack.Screen
          name="post/[id]"
          options={{
            title: "Post",
            headerStyle: { backgroundColor: "#bfdbfe" },
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
