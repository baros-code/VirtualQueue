import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react'
import {decode, encode} from 'base-64'
import Navigator from "./src/index"
import {Text,View} from "react"

if (!global.btoa) {  global.btoa = encode }
if (!global.atob) { global.atob = decode }

 


export default function LoginApp() {

  


  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  return (
    /** 
    <NavigationContainer>
      <Stack.Navigator>
        { user ? (
          <>
          <Stack.Screen name="Home"
           component={HomeScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Registration" component={RegistrationScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>

  );
  */
   <Navigator/> 
  )      
}