import  { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { StyleSheet } from "react-native";
import { Provider as PaperProvider, MD3LightTheme, MD3DarkTheme } from "react-native-paper";
import { AuthProviderBase } from "./context/AuthBase";
import { AuthNavigation } from "./app/navigation/AuthNavigator";
import { ThemeProviderCustom, useThemeContext } from "./context/ThemeContext";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  useEffect(() => {
    const hideSplash = async () => {
      await SplashScreen.hideAsync();
    };
    hideSplash();
  }, []);

  return (
    <ThemeProviderCustom>
      <MainApp />
    </ThemeProviderCustom>
  );
}

const MainApp = () => {
  const { theme } = useThemeContext(); 
  return (
    <PaperProvider theme={theme as any}>
      <AuthProviderBase>
        <AuthNavigation />
      </AuthProviderBase>
    </PaperProvider>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
