import React from "react";
import { useWindowDimensions } from 'react-native'
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import ProfileStack from "./profileStack";
import HomeStack  from "./homeStack";

const RootDrawerNavigator = createDrawerNavigator();

export default function App() {
  const dimensions = useWindowDimensions();
  return (
    <NavigationContainer>
      <RootDrawerNavigator.Navigator initialRouteName="Home" drawerType={dimensions.width >= 768 ? 'permanent' : 'front'}>
        <RootDrawerNavigator.Screen name="Home" component={HomeStack}  />
        <RootDrawerNavigator.Screen name="Profile" component={ProfileStack} />
      </RootDrawerNavigator.Navigator>
    </NavigationContainer>
  );
}



