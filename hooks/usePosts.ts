import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/api";
import { Post } from "../types/post";

export function usePosts(mode: string, username?: string) {
    const [posts, setPosts] = useState<Post[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const CACHE_KEY = `postsCache_${mode}`;


    // Cargar desde caché 
    useEffect(() => {
        async function loadCache() {
            try {
                const cached = await AsyncStorage.getItem(CACHE_KEY);

                if (cached) {
                    const parsed = JSON.parse(cached);
                    setPosts(parsed);
                }
            } catch (err) {
                console.warn("Error leyendo cache:", err);
            } finally {
                setLoading(false); // La UI ya tiene algo
            }
        }

        loadCache();
    }, [mode]);

    // Fetch real desde backend 
    useEffect(() => {
        async function fetchPosts() {
            let endpoint = "/posts";
            try {
                if (mode === "mine") endpoint = "/posts/mine";
                else if (mode === "following") endpoint = "/posts/following";
                else if (mode === "user" && username)
    endpoint = `/posts/user/${username}`;

                const { data } = await api.get<{ data: Post[] }>(endpoint);

                const newPosts = data.data || [];

                setPosts(newPosts);
                setError(null);

                // Guardar en cache
                await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(newPosts));

            } catch (err: any) {
                const msg =
                    err.response?.data?.error ||
                    err.message ||
                    "Error fetching posts";

                setError(msg);
            }
        }

        fetchPosts();
    }, [mode]);

    return { posts, error, loading };
}
