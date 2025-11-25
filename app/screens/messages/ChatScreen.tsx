import { useEffect, useState, useCallback, useRef } from 'react';
import { View, FlatList } from 'react-native';
import MessageBubble from '../../chat/components/MessageBubble';
import MessageInput from '../../chat/components/MessageInput';
import { getMessagesWith, sendMessage } from '../../chat/services/messageService';
import useSocket from '../../chat/hooks/useSocket';

export default function ChatScreen({ route }: any) {
  const { userId, currentUserId } = route.params;
  const [messages, setMessages] = useState<any[]>([]);
  const flatListRef = useRef<FlatList>(null);

  const safeId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random()}`;
useEffect(() => {
  getMessagesWith(userId).then(r => {

    const normalized = (r || []).map((msg: any, idx: number) => ({
      ...msg,
      id:
        typeof msg.id === 'string'
          ? msg.id
          : typeof msg.id === 'number'
          ? msg.id.toString()
          : safeId(`h-${idx}`),
           text: msg.text || msg.content || "",
    }));


    const sorted = normalized.sort(
      (a: any, b: any) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );


    setMessages(sorted);
  });
}, [userId]);

  // ---- Handler del socket ----
  const onMessage = useCallback((m: any) => {

  const id =
    typeof m.id === 'string'
      ? m.id
      : typeof m.id === 'number'
      ? m.id.toString()
      : safeId('sock');


  const safe = {
    ...m,
    id,
text: m.content || "",  };

  setMessages(prev => [...prev, safe]);
}, []);
;

  const { send } = useSocket(onMessage);

  // ---- Obtener historial ----
  useEffect(() => {
    getMessagesWith(userId).then(r => {
      const normalized = (r || []).map((msg: any, idx: number) => ({
        ...msg,
        id:
          typeof msg.id === 'string'
            ? msg.id
            : typeof msg.id === 'number'
            ? msg.id.toString()
            : safeId(`h-${idx}`),
      }));

      const sorted = normalized.sort(
        (a: any, b: any) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );

      setMessages(sorted);
    });
  }, [userId]);

  // ---- Enviar mensaje ----
const handleSend = async (text: string) => {
  const tempId = safeId('temp');

  const temp = {
    id: tempId,
    content: text,
    text: text,
    sender_id: currentUserId,
    created_at: new Date().toISOString(),
    pending: true,
  };

  setMessages(prev => [...prev, temp]);

  try {
    await sendMessage({
      to: userId,
      text: text,
    });
  } catch (e) {
    console.error("❌ Error enviando mensaje:", e);
  }
}; 


 // ---- Scroll automático ----
useEffect(() => {
  flatListRef.current?.scrollToEnd({ animated: true });
}, [messages.length]);

messages.forEach((m, i) => {
  if (!m.id) console.error("❌ MENSAJE SIN ID EN POSICIÓN", i, m);
});



 return (
  <View style={{ flex: 1 }}>
    <FlatList
      ref={flatListRef}
      data={messages}
      keyExtractor={(m, i) => {
        try {
          if (!m || !m.id) return `fallback-${i}`;
          return String(m.id);
        } catch {
          return `fallback-${i}`;
        }
      }}
      renderItem={({ item }) => (
        <MessageBubble message={item} currentUserId={currentUserId} />
      )}
    />
    <MessageInput onSend={handleSend} />
  </View>
);
}
