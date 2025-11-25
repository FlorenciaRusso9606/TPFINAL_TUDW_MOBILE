import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { getConversations, getMe } from '../../chat/services/messageService';
import { useIsFocused } from "@react-navigation/native";

export default function ChatList({ navigation }: any) {
  const [convs, setConvs] = useState<any[]>([]);
  const [myId, setMyId] = useState<string | null>(null);

  const isFocused = useIsFocused();

  // Obtener mi usuario UNA sola vez
  useEffect(() => {
    getMe().then(user => {
      setMyId(user?.id || null);
    });
  }, []);

  // Fetch conversations SOLO cuando vuelve al foco
  useEffect(() => {
    if (isFocused) {
      getConversations().then(r => {
        setConvs(r || []);
      });
    }
  }, [isFocused]);

  if (!myId) return <Text>Cargando usuario...</Text>;

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <TouchableOpacity
        onPress={() => navigation.navigate("SearchConversation", { currentUserId: myId })}
      >
        <Text>Nuevo chat</Text>
      </TouchableOpacity>

      <FlatList
        data={convs}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("ChatScreen", {
                userId: item.otherUser.id,
                currentUserId: myId,
              })
            }
          >
            <View style={{ padding: 12, borderBottomWidth: 1 }}>
              <Text>{item.otherUser.displayname || item.otherUser.username}</Text>
              <Text style={{ fontSize: 12, color: "#666" }}>
                {item.lastMessage?.text}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
