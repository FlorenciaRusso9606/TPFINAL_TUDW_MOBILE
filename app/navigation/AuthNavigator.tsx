import React, { useEffect } from "react";
import { Text } from "react-native";
import { useAuth } from "../../context/AuthBase";
import { NavigationContainer } from "@react-navigation/native";
import  AppStack  from "./AppStack";
import { AuthStack } from "./AuthStack";
import { useGoogleAuthRedirect } from "../../hooks/useGoogleAuthRedirect";

export const AuthNavigation = () => {
  useGoogleAuthRedirect();

  const { user, loading } = useAuth();

  if (loading) return <Text>Cargando usuario...</Text>;

  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};
