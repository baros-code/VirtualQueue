import React from 'react';
import { useFonts } from "expo-font";
import AppLoading from "expo-app-loading";
import Navigator from "./src/routes/drawer";

export default function App() {
  const getFonts = () => {};
  let [fontsLoaded, setFontsLoaded] = useFonts({
    "nunito-regular": require("./assets/fonts/Nunito-Regular.ttf"),
    "nunito-bold": require("./assets/fonts/Nunito-Bold.ttf"),
  });
  if (fontsLoaded) {
    console.log("fonts loaded");
    return <Navigator />;
  } else {
    console.log("loadingfonts");
    return <AppLoading />;
  }
}

