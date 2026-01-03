import { useLocalSearchParams } from "expo-router";
import { View, Text, ActivityIndicator } from "react-native";
import { FeedPostItem } from "../../../../../components/FeedPostItem";
import { useAuth } from "../../../../../providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { getPost } from "../../../../../services/postService";

export default function PostScreen() {
  const { id } = useLocalSearchParams();
  const { session } = useAuth();
  
  const { data: post, isLoading, error } = useQuery({
    queryKey: ["posts", id],
    queryFn: () => getPost(id as string, session?.accessToken!),
  });

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return <FeedPostItem post={post} />;
}
