import { Slot } from "expo-router";
import { StatusBar } from "react-native";

const RootLayout = () => {
  return (
    <>
      <Slot />
      <StatusBar barStyle="light-content" />
    </>
  );
};

export default RootLayout;
