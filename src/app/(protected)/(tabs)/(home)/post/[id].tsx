import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";
import dummyPosts from "../../../../../dummy/dummyPosts";
import { FeedPostItem } from "../../../../../components/FeedPostItem";

export default function PostScreen() {
  const { id } = useLocalSearchParams();
  const post = dummyPosts.find((post) => post.id === Number(id));
  if (!post) {
    return (
      <View>
        <Text>Post not found</Text>
      </View>
    );
  }
  return <FeedPostItem post={post} />;
}
