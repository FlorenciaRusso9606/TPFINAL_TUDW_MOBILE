import { useState, useEffect, useRef } from "react";
import { View, FlatList, TouchableOpacity } from "react-native";
import { TextInput, List, Avatar } from "react-native-paper";
import api from "../../../api/api";

export default function SearchConversation({ route, navigation }: any) {
  const { currentUserId } = route.params;

  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const debounceRef = useRef<any>(null);

  useEffect(() => {
    if (!q.trim()) {
      setResults([]);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await api.get("/users/search", {
          params: { search: q },
          withCredentials: true,
        });

        const filtered = res.data.results.filter(
          (u: any) => u.id !== currentUserId
        );

        setResults(filtered);
      } catch (err) {
        console.error("SearchConversation error:", err);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [q]);

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("ChatScreen", {
          userId: item.id,
          currentUserId,
        })
      }
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
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput
        label="Buscar usuario para chatear"
        value={q}
        onChangeText={setQ}
        mode="outlined"
        style={{ marginBottom: 12 }}
      />

      <FlatList
        data={results}
        keyExtractor={(u: any) => u.id}
        renderItem={renderItem}
      />
    </View>
  );
}
