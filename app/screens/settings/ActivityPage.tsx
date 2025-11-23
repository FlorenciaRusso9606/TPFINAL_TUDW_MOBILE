import { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { Text, SegmentedButtons, Card, Avatar } from "react-native-paper";
import api from "../../../api/api";

export default function ActivityPage() {
  const [tab, setTab] = useState("likes");

  const [likedPosts, setLikedPosts] = useState([]);
  const [sharedPosts, setSharedPosts] = useState([]);
  const [myComments, setMyComments] = useState([]);

  useEffect(() => {
    async function fetch() {
      const [likes, shares, comments] = await Promise.all([
        api.get("/reactions/mine/posts"),
        api.get("/posts/mine/shared"),
        api.get("/comments/mine"),
      ]);
      setLikedPosts(likes.data);
      setSharedPosts(shares.data);
      setMyComments(comments.data);
    }
    fetch();
  }, []);

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <Text variant="headlineMedium" style={{ marginBottom: 16 }}>
        Tu actividad
      </Text>

      <SegmentedButtons
        value={tab}
        onValueChange={setTab}
        buttons={[
          { value: "likes", label: "Likes" },
          { value: "reposts", label: "Reposts" },
          { value: "comments", label: "Comentarios" },
        ]}
      />

      <View style={{ marginTop: 20 }}>
        {tab === "likes" &&
          likedPosts.map((post) => (
            <Card key={post.id} style={{ marginBottom: 12 }}>
              <Card.Title
                title={post.author_username}
                left={() => (
                  <Avatar.Image
                    size={40}
                    source={{ uri: post.post_author_avatar || "/default-avatar.png" }}
                  />
                )}
              />
              <Card.Content>
                <Text>{post.content}</Text>
              </Card.Content>
            </Card>
          ))}

        {tab === "reposts" &&
          sharedPosts.map((post) => (
            <Card key={post.id} style={{ marginBottom: 12 }}>
              <Card.Title
                title={post.author_username}
                left={() => (
                  <Avatar.Image
                    size={40}
                    source={{ uri: post.post_author_avatar || "/default-avatar.png" }}
                  />
                )}
              />
              <Card.Content>
                <Text>{post.original_content}</Text>
              </Card.Content>
            </Card>
          ))}

        {tab === "comments" &&
          myComments.map((comment) => (
            <Card key={comment.id} style={{ marginBottom: 12 }}>
              <Card.Title
                title={comment.post_author}
                left={() => (
                  <Avatar.Image
                    size={40}
                    source={{ uri: comment.post_author_avatar || "/default-avatar.png" }}
                  />
                )}
              />
              <Card.Content>
                <Text style={{ marginLeft: 20 }}>{comment.content}</Text>
              </Card.Content>
            </Card>
          ))}
      </View>
    </ScrollView>
  );
}
