import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DrawerNavigator  from "./AppNavigator";
import PostDetail from "../screens/PostDetail";

const Stack = createNativeStackNavigator();

export default function AppStack() {
 

  return (
     <Stack.Navigator screenOptions={{ headerShown: false }}>
           <Stack.Screen name="HomeDrawer" component={DrawerNavigator } />
 <Stack.Screen
        name="PostDetail"
        component={PostDetail}
        options={{
          headerShown: true,
          title: "Publicación",
        }}
      />
    </Stack.Navigator>
  );
}
