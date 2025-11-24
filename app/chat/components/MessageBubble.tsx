import { useMemo } from 'react';
import { View, Text, Image } from 'react-native';

type Message = {
  id: string;
  sender_id: string;
  content?: string;
  text?: string; 
  image?: string;
  created_at: string;
};

export default function MessageBubble({
  message,
  currentUserId,
}: {
  message: Message;
  currentUserId: string;
}) {
  const mine = message.sender_id === currentUserId;

  const formattedDate = useMemo(
    () =>
      new Date(message.created_at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    [message.created_at]
  );

  const textToShow = message.text || message.content || "";

  return (
    <View
      style={{
        alignSelf: mine ? "flex-end" : "flex-start",
        maxWidth: "75%",
        marginVertical: 4,
        marginHorizontal: 8,
      }}
    >
      <View
        style={{
          backgroundColor: mine ? "#cfe9ff" : "#eee",
          padding: 10,
          borderRadius: 10,
          borderBottomRightRadius: mine ? 0 : 10,
          borderBottomLeftRadius: mine ? 10 : 0,
        }}
      >
       
        {!!textToShow && <Text>{textToShow}</Text>}

        {message.image ? (
          <Image
            source={{ uri: message.image }}
            style={{
              width: 200,
              height: 200,
              borderRadius: 8,
              marginTop: 6,
            }}
          />
        ) : null}

        <Text
          style={{
            fontSize: 11,
            marginTop: 4,
            color: "#666",
            alignSelf: "flex-end",
          }}
        >
          {formattedDate}
        </Text>
      </View>
    </View>
  );
}
