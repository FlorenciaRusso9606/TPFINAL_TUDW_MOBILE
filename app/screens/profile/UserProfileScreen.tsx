import  { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import api from "../../../api/api";
import { useRoute } from "@react-navigation/native";
import { useAuth } from "../../../context/AuthBase";
import UserProfileHeader from "../../components/profile/ProfileHeader";
import BlockStatusMessageMobile from "../../components/profile/BlockStatusMessage";
import PostList from "../../components/posts/PostList";
import { User } from "types/user";
export default function UserProfileScreen() {
const route = useRoute();
const { user } = useAuth();

const params = route.params as any;

const username =
  params?.fromMyProfile
    ? user.username
    : params?.username;


const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [blockStatus, setBlockStatus] = useState({
    blockedByYou: false,
    blockedByThem: false,
  });

  const [followStatus, setFollowStatus] = useState({
    isFollowing: false,
    isFollowedBy: false,
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);

      try {
        const res = await api.get(`/users/by-username/${username}`);
        const userData = res.data;
        setProfile(userData);

        if (user && userData.id !== user.id) {
          const [b, f] = await Promise.all([
            api.get(`/blocks/${userData.id}/status`),
            api.get(`/follow/${userData.id}/status`),
          ]);

          setBlockStatus(b.data);
          setFollowStatus(f.data);
        }
      } catch (err: any) {
        if (err.response?.status === 404) setError("Usuario no encontrado");
        else if (err.response?.status === 403) setError("Estás bloqueado");
        else setError("Error al cargar el perfil");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [username, user]);

  if (loading)
    return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;

  if (error)
    return (
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 18 }}>{error}</Text>
      </View>
    );

  const isOwnProfile = user?.id === profile.id;

  return (
    <ScrollView>
      <UserProfileHeader
        profile={profile}
        isOwnProfile={isOwnProfile}
        blockStatus={blockStatus}
        setBlockStatus={setBlockStatus}
        followStatus={followStatus}
        setFollowStatus={setFollowStatus}
      />

      <BlockStatusMessageMobile
  blockStatus={blockStatus}
  profile={profile}
  onUnblock={() => api.delete(`/blocks/${profile.id}`)} // pequeño fix
/>


      {!blockStatus.blockedByThem &&
        !blockStatus.blockedByYou &&
        !loading && (
          isOwnProfile ? (
            <PostList initialMode="mine" />
          ) : (
            <PostList initialMode="user" username={username}/>
          )
        )}
    </ScrollView>
  );
}
