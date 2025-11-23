import { View, Alert } from "react-native";
import { Text, List } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { User, Palette, Activity, LogOut } from "lucide-react-native";
import { useAuth } from "../../../context/AuthBase";

export default function SettingsHome() {
  const navigation = useNavigation();
  const { logout } = useAuth();

  function handleLogout() {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás segura de que querés salir?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Cerrar sesión",
          style: "destructive",
          onPress: logout,
        }
      ]
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text variant="headlineMedium" style={{ marginBottom: 16 }}>
        Configuración
      </Text>

      <List.Section>
        <List.Item
          title="Editar perfil"
          left={() => <User size={22} style={{ marginTop: 8 }} />}
          onPress={() => navigation.navigate("EditProfile" as never)}
        />

        <List.Item
          title="Apariencia"
          left={() => <Palette size={22} style={{ marginTop: 8 }} />}
          onPress={() => navigation.navigate("Appearance" as never)}
        />

        <List.Item
          title="Actividad"
          left={() => <Activity size={22} style={{ marginTop: 8 }} />}
          onPress={() => navigation.navigate("Activity" as never)}
        />

        <List.Item
          title="Cerrar sesión"
          left={() => <LogOut size={22} style={{ marginTop: 8 }} />}
          onPress={handleLogout}
        />
      </List.Section>
    </View>
  );
}
