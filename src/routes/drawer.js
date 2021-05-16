import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import ProfileStack from "./profileStack";
import HomeStack  from "./homeStack";

const RootDrawerNavigator = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <RootDrawerNavigator.Navigator initialRouteName="Home">
        <RootDrawerNavigator.Screen name="Home" component={HomeStack} />
        <RootDrawerNavigator.Screen name="Profile" component={ProfileStack} />
      </RootDrawerNavigator.Navigator>
    </NavigationContainer>
  );
}



