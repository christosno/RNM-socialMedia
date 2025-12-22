import { StatusBar } from "expo-status-bar";
import { FlatList, View } from "react-native";
import "./global.css";
import { FeedPostItem } from "./src/components/FeedPostItem";
import dummyPosts from "./src/dummy/dummyPosts";

export default function App() {
  return (
    <View className="flex-1 justify-center bg-white dark:bg-black pt-24">
      <FlatList
        data={dummyPosts}
        renderItem={({ item }) => <FeedPostItem post={item} />}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
      />
      <StatusBar style="auto" />
    </View>
  );
}
