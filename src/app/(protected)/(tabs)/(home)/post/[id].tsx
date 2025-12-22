import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

export default function PostScreen() {
  const { id } = useLocalSearchParams();
  return (
    <View>
      <Text>Post {id}</Text>
    </View>
  );
}
