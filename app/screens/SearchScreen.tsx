import { View, FlatList, TouchableOpacity } from "react-native";
import { TextInput, List, Avatar, Card } from "react-native-paper";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../types/Navigation";
import { useUserSearch } from "../../hooks/useSearch";
import type { User } from "../../types/user";

export default function SearchScreen() {
  const { q, setQ, results } = useUserSearch();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const renderItem = ({ item }: { item: User }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("ProfileStack", {
  screen: "UserProfile",
  params: { username: item.username }
})}
    >
      <List.Item
        title={item.displayname || item.username}
        description={`@${item.username}`}
        left={() =>
          item.profile_picture_url ? (
            <Avatar.Image size={40} source={{ uri: item.profile_picture_url }} />
          ) : (
            <Avatar.Text size={40} label={item.username[0].toUpperCase()} />
          )
        }
      />
    </TouchableOpacity>
  );

  return (
    <View style={{ width: "100%", position: "relative", padding: 16 }}>
      <TextInput
        label="Buscar usuario"
        value={q}
        onChangeText={setQ}
        mode="outlined"
        style={{ marginBottom: 8 }}
      />

      {results.length > 0 && (
        <Card
          style={{
            maxHeight: 300,
            position: "absolute",
            top: 70,
            left: 16,
            right: 16,
            zIndex: 10,
          }}
        >
          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
          />
        </Card>
      )}
    </View>
  );
}
