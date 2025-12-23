import { router, Stack } from "expo-router";
import { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";

export default function NewPost() {
  const [content, setContent] = useState("");

  const handlePost = () => {
    console.log(content);
    setContent("");
    router.back();
  };

  return (
    <View className="flex-1 p-4">
      <Stack.Screen
        options={{
          headerLeft: () => (
            <Text
              className="text-lg font-bold text-blue-500"
              onPress={() => router.back()}
            >
              Cancel
            </Text>
          ),
          headerRight: () => (
            <Button
              color={content.trim().length === 0 ? "gray" : "blue"}
              disabled={content.trim().length === 0}
              title="Post"
              onPress={handlePost}
            />
          ),
        }}
      />
      <TextInput
        value={content}
        onChangeText={setContent}
        className="text-lg min-h-40 border border-gray-300 rounded "
        placeholder="Content"
        multiline
        autoFocus
      />
    </View>
  );
}
