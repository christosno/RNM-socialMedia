import { FlatList, Pressable } from "react-native";
import { FeedPostItem } from "../../../../components/FeedPostItem";
import dummyPosts from "../../../../dummy/dummyPosts";
import { Link } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

export default function App() {
  return (
    <>
      <FlatList
        data={dummyPosts}
        renderItem={({ item }) => (
          <Link href={`/post/${item.id}`}>
            <FeedPostItem post={item} />
          </Link>
        )}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
      />
      <Link href="/new" asChild>
        <Pressable className="absolute right-5 bottom-5 bg-[#007AFF] rounded-full w-[60px] h-[60px] items-center justify-center shadow-lg">
          <AntDesign name="plus" size={24} color="white" />
        </Pressable>
      </Link>
    </>
  );
}
