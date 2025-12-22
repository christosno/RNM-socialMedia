import { Button, FlatList } from "react-native";
import { FeedPostItem } from "../../../../components/FeedPostItem";
import dummyPosts from "../../../../dummy/dummyPosts";
import { Link } from "expo-router";
import { useAuth } from "../../../../providers/AuthProvider";

export default function App() {
  const { logout } = useAuth();
  return (
    <FlatList
      data={dummyPosts}
      renderItem={({ item }) => (
        <Link href={`/post/${item.id}`}>
          <FeedPostItem post={item} />
        </Link>
      )}
      keyExtractor={(item) => item.id.toString()}
      showsVerticalScrollIndicator={false}
      ListFooterComponent={<Button title="Logout" onPress={logout} />}
    />
  );
}
