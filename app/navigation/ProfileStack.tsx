import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SettingsHome from "../screens/settings/SettingsHome";
import AppearancePage from "../screens/settings/AppearancePage";
import ActivityPage from "../screens/settings/ActivityPage";
import EditProfilePage from "../screens/settings/EditProfilePage";
import UserProfileScreen from "../screens/profile/UserProfileScreen";

const Stack = createNativeStackNavigator();

export default function ProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: "600",
        },
      }}
    >
      {/* MI PERFIL (pantalla principal del tab) */}
   <Stack.Screen
  name="MyProfile"
  component={UserProfileScreen}
  initialParams={{ fromMyProfile: true }}
  options={{ title: "Mi Perfil" }}
/>

<Stack.Screen
  name="UserProfile"
  component={UserProfileScreen}
  options={{ title: "Perfil" }}
/>


      {/* CONFIGURACIONES */}
      <Stack.Screen 
        name="SettingsHome" 
        component={SettingsHome}
        options={{ title: "Ajustes" }}
      />

      <Stack.Screen 
        name="EditProfilePage" 
        component={EditProfilePage}
        options={{ title: "Editar perfil" }}
      />

      <Stack.Screen 
        name="AppearancePage" 
        component={AppearancePage}
        options={{ title: "Apariencia" }}
      />

      <Stack.Screen 
        name="ActivityPage" 
        component={ActivityPage}
        options={{ title: "Actividad" }}
      />
    </Stack.Navigator>
  );
}
