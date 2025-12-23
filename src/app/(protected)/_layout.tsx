import { Stack } from "expo-router";

export default function ProtectedLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false, title: "Feed" }} />
      <Stack.Screen name="new" options={{ title: "New Post", presentation: "modal", animation: "slide_from_bottom" }} />
    </Stack>
  );
}
