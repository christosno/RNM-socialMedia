import { router, Stack } from "expo-router";
import { useState } from "react";
import { View, TextInput, Button, Text, Alert } from "react-native";
import { useAuth } from "../../providers/AuthProvider";
import { createPostRequest } from "../../services/postService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function NewPost() {
  const { session } = useAuth();
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();

  const { mutate: createPost, isPending } = useMutation({
    mutationFn: () => createPostRequest({ content }, session?.accessToken!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setContent("");
      router.back();
    },
    onError: (error) => {
      Alert.alert("Error", error.message);
    },
  });


  return (
    <View className="flex-1 p-4">
      <Stack.Screen
        options={{
          headerLeft: () => (
            <Text
              className="text-lg font-bold text-blue-500 p-2"
              onPress={() => router.back()}
            >
              Cancel
            </Text>
          ),
          headerRight: () => (
            <Button
              color={content.trim().length === 0 ? "gray" : "blue"}
              disabled={content.trim().length === 0 || isPending}
              title="Post"
              onPress={() => createPost()}
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
