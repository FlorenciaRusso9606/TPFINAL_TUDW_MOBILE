import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, Button } from "react-native-paper";
import { FlatList, View, StyleSheet } from "react-native";
import ToggleButton from "../components/ToggleButton";
import { usePosts } from "../../hooks/usePosts";
import PostCard from "../components/posts/PostCard";

export default function FeedScreen() {
  const [mode, setMode] = useState<"all" | "following">("all");
  const [hydrated, setHydrated] = useState(false);

  const { posts, loading, error } = usePosts(mode);


  useEffect(() => {
    async function loadMode() {
      const saved = await AsyncStorage.getItem("feedMode");
      if (saved === "all" || saved === "following") setMode(saved);
      setHydrated(true);
    }
    loadMode();
  }, []);

  useEffect(() => {
    if (hydrated) AsyncStorage.setItem("feedMode", mode);
  }, [mode, hydrated]);

  if (!hydrated) return null;


  return (
    <View style={{ flex: 1, paddingTop: 48, paddingHorizontal: 16 }}>
      <View style={styles.topRight}>
        <ToggleButton />
      </View>

      <Text variant="headlineMedium" style={styles.title}>Mi Feed</Text>

      <View style={styles.toggleContainer}>
        <View style={styles.buttonGroup}>
          <Button
            mode={mode === "all" ? "contained" : "outlined"}
            onPress={() => setMode("all")}
          >
            Todos
          </Button>

          <Button
            mode={mode === "following" ? "contained" : "outlined"}
            onPress={() => setMode("following")}
          >
            Seguidos
          </Button>
        </View>
      </View>

  
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <PostCard post={item} />}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListEmptyComponent={<Text>No hay posts todavía</Text>}
        ListFooterComponent={loading ? <Text>Cargando...</Text> : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  topRight: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
  },
  title: {
    marginBottom: 24,
    textAlign: "center",
    fontWeight: "600",
  },
  toggleContainer: {
    width: "100%",
    gap: 16,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
});
