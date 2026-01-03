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

  const {mutate: likePost} = useMutation({
    mutationFn: () => likePostRequest(post.id, session?.accessToken!),
    onMutate: async (_, context) => {
      await context.client.cancelQueries({ queryKey: ["posts"] });
      const previousPosts = context.client.getQueryData(["posts"]);
      context.client.setQueryData(["posts"], (old: any) => old.map((p: Post) => p.id === post.id ? { ...p, is_liked: true, likes_count: p.likes_count + 1 } : p));
      return { previousPosts };
    },
    onError: (error, _posts , onMutateResult , context) => {
      console.error(error);
      context.client.setQueryData(["posts"], onMutateResult?.previousPosts);
    },
    onSettled: (_data, _error, _variables, _onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const {mutate: unlikePost} = useMutation({
    mutationFn: () => unlikePostRequest(post.id, session?.accessToken!),
    onMutate: async (_, context) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      const previousPosts = queryClient.getQueryData(["posts"]);
      queryClient.setQueryData(["posts"], (old: any) => old.map((p: Post) => p.id === post.id ? { ...p, is_liked: false, likes_count: p.likes_count - 1 } : p));
      return { previousPosts };
    },
    onError: (error, _posts , onMutateResult , context) => {
      console.error(error);
      queryClient.setQueryData(["posts"], onMutateResult?.previousPosts);
    },
    onSettled: (_data, _error, _variables, _onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: ["posts"] });
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
          <View className="flex-row items-center gap-1">
            <MaterialCommunityIcons
              onPress={() => post.is_liked ? unlikePost() : likePost()}
              name={post.is_liked ? "heart" : "heart-outline"}
              size={20}
              color={post.is_liked ? "crimson" : "gray"}
            />
            <Text className="text-gray-500">{post.likes_count}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
