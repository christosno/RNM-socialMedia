import { View, Text, Image } from "react-native";
import { Post } from "../types/models";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "../providers/AuthProvider";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import { likePostRequest, unlikePostRequest } from "../services/postService";

dayjs.extend(relativeTime);

type FeedPostItemProps = {
  post: Post;
};

export function FeedPostItem({ post }: FeedPostItemProps) {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  const likePostMutation = useMutation({
    mutationFn: () => likePostRequest(post.id, session?.accessToken!),
    onSettled: () => {
      return queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const unlikePostMutation = useMutation({
    mutationFn: () => unlikePostRequest(post.id, session?.accessToken!),
    onSettled: () => {
      return queryClient.invalidateQueries({ queryKey: ["posts"] });
    }
  });

  return (
    <View className="flex-row gap-3 p-4 border-b border-gray-200 dark:border-gray-800">
      <Image
        source={{ uri: post.author.avatar }}
        className="w-10 h-10 rounded-full"
      />
      <View className="gap-2 flex-1">
        <View className="flex-row gap-1">
          <Text className="font-semibold">{post.author.name}</Text>
          <Text className=" text-gray-500">{post.author.handle}</Text>
          <Text className="text-gray-500">·</Text>
          <Text className=" text-gray-500">
            {dayjs(post.created_at).fromNow(true)}
          </Text>
        </View>
        <Text className="leading-5">{post.content}</Text>

        <View className="flex-row gap-5">
          <View className="flex-row items-center gap-1">
            <MaterialCommunityIcons
              name="message-outline"
              size={20}
              color="gray"
            />
            <Text className="text-gray-500">{post.replies_count}</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <MaterialCommunityIcons name="repeat" size={20} color="gray" />
            <Text className="text-gray-500">{post.retweets_count}</Text>
          </View>
          {likePostMutation.isPending ? (
              <View className="flex-row items-center gap-1">
              <MaterialCommunityIcons
                name={"heart"}
                size={20}
                color={ "crimson" }
              />
              <Text className="text-gray-500">{post.likes_count + 1}</Text>
            </View>
            ) : unlikePostMutation.isPending ? (
              <View className="flex-row items-center gap-1">
              <MaterialCommunityIcons
                name={"heart-outline"}
                size={20}
                color={ "grey" }
              />
              <Text className="text-gray-500">{post.likes_count -1 }</Text>
            </View>
            ) : (
             <View className="flex-row items-center gap-1">
              <MaterialCommunityIcons
                onPress={() => post.is_liked ? unlikePostMutation.mutate() : likePostMutation.mutate()}
                name={post.is_liked ? "heart" : "heart-outline"}
                size={20}
                color={post.is_liked ? "crimson" : "gray"}
              />
              <Text className="text-gray-500">{post.likes_count}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
