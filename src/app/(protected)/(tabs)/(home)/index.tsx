import { ActivityIndicator, FlatList, Pressable, Text } from "react-native";
import { FeedPostItem } from "../../../../components/FeedPostItem";
import { Link } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuth } from "../../../../providers/AuthProvider";
import { getPosts } from "../../../../services/postService";
import { useRefreshOnFocus } from "../../../../hooks/tanstack";

const QueryKey = ["posts"];

export default function FeedScreen() {
  const { session } = useAuth();

  useRefreshOnFocus(QueryKey);

  const {
    data: posts,
    isLoading,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: QueryKey,
    queryFn: ({ pageParam }) => getPosts(pageParam, session?.accessToken!),
    getNextPageParam: (lastPage) => {
      if (lastPage.length === 0) {
        return undefined;
      }
      return {
        limit: 5,
        cursor: lastPage[lastPage.length - 1].id,
      };
    },
    initialPageParam: { limit: 20, cursor: undefined },
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
        data={posts?.pages.flat()}
        renderItem={({ item }) => (
          <Link href={`/post/${item.id}`}>
            <FeedPostItem post={item} />
          </Link>
        )}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        refreshing={false}
        onRefresh={refetch}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={1.5}
        ListFooterComponent={() =>
          isFetchingNextPage ? <ActivityIndicator /> : null
        }
      />
      <Link href="/new" asChild>
        <Pressable className="absolute right-5 bottom-5 bg-[#007AFF] rounded-full w-[60px] h-[60px] items-center justify-center shadow-lg">
          <AntDesign name="plus" size={24} color="white" />
        </Pressable>
      </Link>
    </>
  );
}
