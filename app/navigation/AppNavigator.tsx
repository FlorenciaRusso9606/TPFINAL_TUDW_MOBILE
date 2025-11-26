import { createDrawerNavigator } from "@react-navigation/drawer";
import BottomTabs from "./BottomTabs";
import SidebarDrawer from "app/components/sidebar/MainTabs ";
import { RootDrawerParamList } from "../../types/Navigation";

const Drawer = createDrawerNavigator<RootDrawerParamList>();

export default function DrawerNavigator() {
  const drawerProps: any = {
    drawerContent: (props: any) => <SidebarDrawer {...props} />,
    screenOptions: { headerShown: false, drawerType: "front" },
  };

  return (
    <Drawer.Navigator {...drawerProps}>
      <Drawer.Screen name="MainTabs" component={BottomTabs} />
    </Drawer.Navigator>
  );
}
