import { FlatList, Pressable } from "react-native";
import { FeedPostItem } from "../../../../components/FeedPostItem";
import dummyPosts from "../../../../dummy/dummyPosts";
import { Link } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { Post } from "../../../../types/models";
import { useEffect, useState } from "react";

export default function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("/api/posts");
      const data = await response.json();
      console.log("🚀 ~ fetchPosts ~ data:", data);
      setPosts(data.posts);
    };
    fetchPosts();
  }, []);
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
      />
      <Link href="/new" asChild>
        <Pressable className="absolute right-5 bottom-5 bg-[#007AFF] rounded-full w-[60px] h-[60px] items-center justify-center shadow-lg">
          <AntDesign name="plus" size={24} color="white" />
        </Pressable>
      </Link>
    </>
  );
}
