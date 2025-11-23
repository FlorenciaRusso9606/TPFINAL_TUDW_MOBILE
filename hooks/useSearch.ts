import { useState, useRef, useEffect } from "react";
import api from "../api/api";
import type { User } from "../types/user";

export function useUserSearch() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!q.trim()) {
      setResults([]);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await api.get<{ results: User[] }>("/users/search", {
          params: { search: q },
          withCredentials: true,
        });
        setResults(res.data.results);
      } catch (err) {
        console.error("Search error:", err);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [q]);

  return { q, setQ, results };
}
