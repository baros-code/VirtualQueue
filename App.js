import React, {useEffect, useState, useMemo, useContext } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList, } from "@react-navigation/drawer";
import { Ionicons } from '@expo/vector-icons'; 
import { TouchableOpacity, Button } from 'react-native';

import { firebase } from './src/firebase/config'
import  { AuthContext }  from "./src/Authentication/AuthContext";

import  { Splash }  from "./src/SplashScreen"
import  LoginScreen  from "./src/Authentication/LoginScreen";
import  RegistrationScreen  from "./src/Authentication/RegistrationScreen";
import  PhoneAuthentication  from "./src/Authentication/PhoneAuthentication";

import  ProfileScreen  from "./src/ProfileScreen";

import  ClientDashboard  from "./src/Client/ClientDashboard";
import  Services  from "./src/Client/Services";
import  Organizations  from "./src/Client/Organizations";
import  CreateReservation  from "./src/Client/CreateReservation";
import  ReservationDetails  from "./src/Client/ReservationDetails";


import  EmployeeDashboard  from "./src/Employee/EmployeeDashboard";
import  MyQueues  from "./src/Employee/MyQueues"
import  ClientDetails  from "./src/Employee/ClientDetails"


const AuthStack = createStackNavigator();

const AuthStackScreen = () => (
  <AuthStack.Navigator>
    <AuthStack.Screen
      name="SignIn"
      component={LoginScreen}
      options={{ title: "Sign In" }}
    />
    <AuthStack.Screen
      name="Register"
      component={RegistrationScreen}
      options={{ title: "Create Account" }}
    />
    <AuthStack.Screen
      name="Verification"
      component={PhoneAuthentication}
      options={{ title: "Phone Verficiation" }}
    />
  </AuthStack.Navigator>
);

const Tabs = createBottomTabNavigator();

const HomeStack = createStackNavigator();
const CreateReservationStack = createStackNavigator();


const HomeStackScreen = ({navigation}) => (
  <HomeStack.Navigator>
    <HomeStack.Screen name="Dashboard" 
    component={ClientDashboard}
    options={{headerTitle: "Dashboard", headerLeft: () => (
      <TouchableOpacity style={{paddingLeft: 15}}onPress={() => navigation.openDrawer()}>
        <Ionicons name="menu" size={24} color="black" />
      </TouchableOpacity>
    )}}
    />
    <HomeStack.Screen
      name="ReservationDetails"
      component={ReservationDetails}
      options={({ route }) => ({
        title: route.params.name
      })}
    />
  </HomeStack.Navigator>
);

/*route.params ile seçilen servis, organizasyon id geçirilecek. */
const CreateReservationStackScreen = ({navigation}) => (
  <CreateReservationStack.Navigator>
    <CreateReservationStack.Screen name="Services" component={Services}     
    options={{ headerLeft: () => (
      <TouchableOpacity style={{paddingLeft: 15}}onPress={() => navigation.navigate("Home",{screen: "Dashboard"}) }>
        <Ionicons name="arrow-back-outline" size={24} color="black" />
      </TouchableOpacity>
    )}} 
    />
    <CreateReservationStack.Screen name="Organizations" component={Organizations} />
    <CreateReservationStack.Screen name="CreateReservation" component={CreateReservation} />
  </CreateReservationStack.Navigator>
);

const ProfileStack = createStackNavigator();

const ProfileStackScreen = ({navigation}) => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen 
    name="Profile" 
    component={ProfileScreen}
    options={{ headerLeft: () => (
      <TouchableOpacity style={{paddingLeft: 15}}onPress={() => navigation.navigate("Home",{screen: "Dashboard"}) }>
        <Ionicons name="arrow-back-outline" size={24} color="black" />
      </TouchableOpacity>
    )}}
    />
  </ProfileStack.Navigator>
);



/*BOTTOM TAB NAVIGATOR */
/* {userToken} parametre olarak alınacak, role = 0 , 1, 2 ise 
ona göre tab'ler çıkarılacak aşağıda.
ClientStack, EmployeeStack, AdminStack oluşturulacak Home'lara atanacak!
*/ 
const TabsScreen = () => {
    return (
    <Tabs.Navigator shifting={true} 
    labeled={false} 
    screenAnimationEnabled={false} 
    activeColor="#00aea2" 
    inactiveColor="#95a5a6" 
    barStyle={{ backgroundColor: "#ffff"}}
    tabBarOptions={{ showIcon: true, labelStyle: { fontSize: 12 }}}
    >
      <Tabs.Screen name="Home" component={HomeStackScreen} options={  {tabBarIcon:() => (<Ionicons name="home" size={24} color="black" />) }  }/>
      <Tabs.Screen name="Create Reservation" component={CreateReservationStackScreen} options={ {tabBarIcon:() => (<Ionicons name="create" size={24} color="black" />)}  }/>
    </Tabs.Navigator>
    );
  
  // else if (userToken.role === 1) {
  //   return (
  //   <Tabs.Navigator>
  //     <Tabs.Screen name="Home" component={HomeStackScreen} />
  //     <Tabs.Screen name="My Queues" component={CreateReservationStackScreen} />
  //   </Tabs.Navigator>
  //   );
  // }
  // else if (userToken.role === 2) {
  //   return (
  //   <Tabs.Navigator>
  //     <Tabs.Screen name="Home" component={HomeStackScreen} />
  //     <Tabs.Screen name="My Queues" component={MyQueues} />
  //   </Tabs.Navigator>
  //   );
  // }

};

const CustomDrawerContent = (props) => {
  const { signOut } = useContext(AuthContext);
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem label="Signout" onPress={() => signOut() } />
    </DrawerContentScrollView>
  );
}

const Drawer = createDrawerNavigator();

const DrawerScreen = () => (
  <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />} >
    <Drawer.Screen name="Home" component={TabsScreen}  />
    <Drawer.Screen name="Profile" component={ProfileStackScreen} />
  </Drawer.Navigator>
);


const RootStack = createStackNavigator();

const RootStackScreen = ({ userToken }) => (
  <RootStack.Navigator headerMode="none" >
    {userToken ? (
      <RootStack.Screen
        name="App"
        component={DrawerScreen}
        options={{
          animationEnabled: false
        }}
      />
    ) : (
      <RootStack.Screen
        name="Auth"
        component={AuthStackScreen}
        options={{
          animationEnabled: false
        }}
      />
    )}
  </RootStack.Navigator>
);

export default () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  const authContext = useMemo(() => {
    return {
      onLoginPress: (email,password) => {
        setIsLoading(false);
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then((response) => {
                const uid = response.user.uid
                const usersRef =firebase.database().ref("users/" + uid)
                usersRef.get()
                    .then((userData) => {
                        if (!userData.exists) {
                            alert("User does not exist anymore.");
                            return;
                        }
                        const data = {...userData.val(), uid: uid}; //add uid property to data object
                        setUserToken(data);
                    })
                    .catch(error => {
                        alert(error);
                    });
            })
            .catch(error => {
                alert(error);
            })
      },
      signUp: () => {
        setIsLoading(false);
        setUserToken("asdf");
      },
      signOut: () => {
        setIsLoading(false);
        var auth = firebase.auth();
        auth.signOut().then(function() {
          console.log("Sign Out succesful.");
          setUserToken(null);
        }).catch(function(error) {
          console.log("Error while signing out: " + error);
        });
      },
      userToken: userToken
    };
  }, [userToken]);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return <Splash />;
  }

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#0e66d4'
    },
  };

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer theme={MyTheme}>
        <RootStackScreen userToken={userToken} />
      </NavigationContainer>
    </AuthContext.Provider>
  );

};