import { AuthProvider, useAuth } from "@/provider/auth-provider";
import { Slot, useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";
import { StatusBar } from "react-native";

const InitialLayout = () => {
  const { session, initialized } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!initialized) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (session && !inAuthGroup) {
      // Redirect authenticated users to the list page
      router.replace("/list");
    } else if (!session) {
      // Redirect unauthenticated users to the login page
      router.replace("/");
    }
  }, [session, initialized]);

  return (
    <React.Fragment>
      <Slot />
    </React.Fragment>
  );
};

const RootLayout = () => {
  return (
    <AuthProvider>
      <InitialLayout />
      <StatusBar barStyle="light-content" />
    </AuthProvider>
  );
};

export default RootLayout;
