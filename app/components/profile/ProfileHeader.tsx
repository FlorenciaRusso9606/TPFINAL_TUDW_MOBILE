import { useEffect, useState } from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Text, Avatar, Divider, useTheme } from "react-native-paper";
import { Settings } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import api from "../../../api/api";
import ProfileActions from "./ProfileActions";
import { User, BlockStatus, FollowStatus } from "../../../types/user";
import { useNavigation } from "@react-navigation/core";

interface Props {
  profile: User;
  isOwnProfile: boolean;
  blockStatus: BlockStatus;
  setBlockStatus: (status: BlockStatus) => void;
  followStatus: FollowStatus;
  setFollowStatus: (status: FollowStatus) => void;
}

export default function ProfileHeader({
  profile,
  isOwnProfile,
  blockStatus,
  setBlockStatus,
  followStatus,
  setFollowStatus,
}: Props) {
  const theme = useTheme();
  const [flag, setFlag] = useState<string | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    async function fetchFlag() {
      if (!profile.country_iso) return;
      try {
        const res = await api.get(`/countries/${profile.country_iso}/flag`);
        setFlag(res.data.flag);
      } catch (err) {
        console.error("Error al traer la bandera:", err);
      }
    }
    fetchFlag();
  }, [profile.country_iso]);

  return (
    <View style={styles.container}>
      
      {/* HEADER CON DEGRADADO */}
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primaryContainer]}
        style={styles.headerGradient}
      />

      {/* BOTÓN DE AJUSTES (si es tu perfil) */}
      {isOwnProfile && (
        <TouchableOpacity
          onPress={() => navigation.navigate("SettingsHome" as never)}
          style={styles.settingsButton}
        >
          <Settings size={24} color="#fff" />
        </TouchableOpacity>
      )}

      {/* AVATAR */}
      <View style={styles.avatarContainer}>
        {profile.profile_picture_url ? (
          <Avatar.Image
            source={{ uri: profile.profile_picture_url }}
            size={150}
            style={styles.avatar}
          />
        ) : (
          <Avatar.Text
            size={150}
            label={profile.username.charAt(0).toUpperCase()}
            style={styles.avatar}
          />
        )}
      </View>

      {/* INFORMACIÓN */}
      <View style={styles.infoContainer}>
        <Text variant="headlineSmall" style={styles.username}>
          {profile.username}
        </Text>

        {profile.displayname && (
          <Text variant="titleSmall" style={styles.displayname}>
            {profile.displayname}
          </Text>
        )}

        {isOwnProfile && (
          <TouchableOpacity
            onPress={() => navigation.navigate("EditProfilePage" as never)}
            style={styles.editButton}
          >
            <Text style={styles.editButtonText}>Editar perfil</Text>
          </TouchableOpacity>
        )}

        <Text
          variant="bodyMedium"
          style={[
            styles.bio,
            {
              color: profile.bio
                ? theme.colors.onSurface
                : theme.colors.onSurfaceDisabled,
              fontStyle: profile.bio ? "normal" : "italic",
            },
          ]}
        >
          {profile.bio || "Este usuario no tiene biografía"}
        </Text>

        {!isOwnProfile && (
          <ProfileActions
            profile={profile}
            blockStatus={blockStatus}
            setBlockStatus={setBlockStatus}
            followStatus={followStatus}
            setFollowStatus={setFollowStatus}
          />
        )}

        {(profile.city || profile.country_iso) && (
          <View style={styles.locationRow}>
            <Text style={styles.locationText}>
              {profile.city
                ? `${profile.city}${profile.country_iso ? ", " : ""}`
                : ""}
              {profile.country_iso}
            </Text>
            {flag && (
              <Image
                source={{ uri: flag }}
                style={styles.flagImage}
              />
            )}
          </View>
        )}

        {/* STATS */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profile.posts_count ?? 0}</Text>
            <Text style={styles.statLabel}>publicaciones</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profile.followers_count ?? 0}</Text>
            <Text style={styles.statLabel}>seguidores</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profile.following_count ?? 0}</Text>
            <Text style={styles.statLabel}>seguidos</Text>
          </View>
        </View>

        <Divider style={{ marginTop: 20, width: "100%" }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 24,
  },
  headerGradient: {
    height: 160,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  settingsButton: {
    position: "absolute",
    top: 45,
    right: 20,
    zIndex: 5,
  },
  avatarContainer: {
    position: "absolute",
    top: 90,
    left: "50%",
    transform: [{ translateX: -75 }],
    zIndex: 10,
  },
  avatar: {
    backgroundColor: "#ccc",
    borderWidth: 4,
    borderColor: "#fff",
  },
  infoContainer: {
    marginTop: 180,
    alignItems: "center",
    paddingHorizontal: 16,
  },
  username: {
    fontWeight: "700",
    marginTop: 10,
  },
  displayname: {
    color: "#666",
    marginTop: 4,
    marginBottom: 8,
  },
  editButton: {
    backgroundColor: "#eee",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginTop: 6,
  },
  editButtonText: {
    fontSize: 14,
  },
  bio: {
    marginTop: 10,
    textAlign: "center",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  locationText: {
    color: "#666",
  },
  flagImage: {
    width: 18,
    height: 12,
    marginLeft: 6,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
    width: "100%",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontWeight: "700",
    fontSize: 16,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
  },
});
