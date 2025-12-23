import { View, Text, Button } from "react-native";
import { useAuth } from "../../../providers/AuthProvider";

export default function ProfileScreen() {
  const { logout } = useAuth();
  return (
    <View>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}
