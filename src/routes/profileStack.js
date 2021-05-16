import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Profile from '../ProfileScreen';



const ProfileStack = createStackNavigator();

export default function myStacks() {
  return (
    <ProfileStack.Navigator initialRouteName="Profile" headerMode="screen">
      <ProfileStack.Screen name="Profile" component={Profile} options={{ title: "Settings" }} />
    </ProfileStack.Navigator>
  );
}

