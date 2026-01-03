import { ActivityIndicator, FlatList, Pressable, Text } from "react-native";
import { FeedPostItem } from "../../../../components/FeedPostItem";
import { Link } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../../providers/AuthProvider";
import { getPosts } from "../../../../services/postService";


export default function App() {
  const { session } = useAuth();

  const { data: posts, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ["posts"],
    queryFn: () => getPosts(session?.accessToken!),
  });

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <>
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <Link href={`/post/${item.id}`}>
            <FeedPostItem post={item} />
          </Link>
        )}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        refreshing={isRefetching}
        onRefresh={refetch}
      />
      <Link href="/new" asChild>
        <Pressable className="absolute right-5 bottom-5 bg-[#007AFF] rounded-full w-[60px] h-[60px] items-center justify-center shadow-lg">
          <AntDesign name="plus" size={24} color="white" />
        </Pressable>
      </Link>
    </>
  );
}
