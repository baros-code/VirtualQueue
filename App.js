import React, {useEffect, useState, useMemo, useContext } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList, } from "@react-navigation/drawer";
import { Ionicons } from '@expo/vector-icons'; 
import { TouchableOpacity, View } from 'react-native';

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
import ListClients  from "./src/Employee/ListClients"
import  ClientDetails  from "./src/Employee/ClientDetails"

import AdminDashboard  from "./src/Admin/AdminDashboard"
import QueueForm from "./src/Admin/QueueForm"


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
const MyQueuesStack = createStackNavigator();
const CreateQueueStack = createStackNavigator();


const HomeStackScreen = ({navigation}) => {
  const { userToken } = useContext(AuthContext);
  const getDashboard = () => {
    if(userToken.role === 0)
        return ClientDashboard;
    else if(userToken.role === 1)
        return EmployeeDashboard;
    else if(userToken.role === 2)
        return AdminDashboard;
    else
        return null;
  };
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Dashboard" 
      component= {getDashboard()}
      options={{headerTitle: "Dashboard", headerLeft: () => (
        <TouchableOpacity style={{paddingLeft: 15}}onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={24} color="black" />
        </TouchableOpacity>
      )}}
      />
      {/* {userToken.role === 1 ? <HomeStack.Screen name="Dashboard" 
      component={EmployeeDashboard}
      options={{headerTitle: "Dashboard", headerLeft: () => (
        <TouchableOpacity style={{paddingLeft: 15}}onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={24} color="black" />
        </TouchableOpacity>
      )}}
      /> : null} */}
      <HomeStack.Screen
        name="ReservationDetails"
        component={ReservationDetails}
        options={({ route }) => ({
          title: route.params.name
        })}
      />
      <HomeStack.Screen
        name="ClientDetails"
        component={ClientDetails}
        options={({ route }) => ({
          title: route.params.name
        })}
      />
      <HomeStack.Screen
        name="QueueForm"
        component={QueueForm}
        initialParams={{editPage: true}}
        options={({ route }) => ({
          title: route.params.name
        })}
      />
      <HomeStack.Screen
        name="ListClients"
        component={ListClients}
        initialParams={{editPage: true}}
        options={({ route }) => ({
          title: route.params.name
        })}
      />
  </HomeStack.Navigator>
  );

};

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

const MyQueuesStackScreen = ({navigation}) => (
  <MyQueuesStack.Navigator>
    <MyQueuesStack.Screen name="MyQueues" component={MyQueues}     
    options={{ headerLeft: () => (
      <TouchableOpacity style={{paddingLeft: 15}}onPress={() => navigation.navigate("Home",{screen: "Dashboard"}) }>
        <Ionicons name="arrow-back-outline" size={24} color="black" />
      </TouchableOpacity>
    )}} 
    />
    <MyQueuesStack.Screen name="ListClients" component={ListClients} />
    <MyQueuesStack.Screen name="ClientDetails" component={ClientDetails} />
  </MyQueuesStack.Navigator>
);

const CreateQueueStackScreen = ({navigation}) => (
  <CreateQueueStack.Navigator>
    <CreateQueueStack.Screen name="CreateQueue" component={QueueForm} initialParams={{editPage: false, queueId: "", }}     
    options={{ headerLeft: () => (
      <TouchableOpacity style={{paddingLeft: 15}}onPress={() => navigation.navigate("Home",{screen: "Dashboard"}) }>
        <Ionicons name="arrow-back-outline" size={24} color="black" />
      </TouchableOpacity>
    )}} 
    />
  </CreateQueueStack.Navigator>
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


const TabsScreen = () => {
    const { userToken } = useContext(AuthContext);
    return (
    <Tabs.Navigator shifting={true} 
    labeled={false} 
    screenAnimationEnabled={false} 
    activeColor="#00aea2" 
    inactiveColor="#95a5a6" 
    barStyle={{ backgroundColor: "#ffff"}}
    tabBarOptions={{ showIcon: true, labelStyle: { fontSize: 12 }}}
    >
      <Tabs.Screen name="Home" component={HomeStackScreen} options={  {tabBarIcon:() => (<Ionicons name="home" size={24} color="#047DB9" />) }  }/> 
      {userToken.role === 0 ? <Tabs.Screen name="Create Reservation" component={CreateReservationStackScreen} options={ {tabBarIcon:() => (<Ionicons name="create" size={24} color="#047DB9" />)} }/> : null}
      {userToken.role === 1 ? <Tabs.Screen name="MyQueues" component={MyQueuesStackScreen} options={ {tabBarIcon:() => (<Ionicons name="create" size={24} color="#047DB9" />)} }/> : null}
      {userToken.role === 2 ? <Tabs.Screen name="Create Queue" component={CreateQueueStackScreen} options={ {tabBarIcon:() => (<Ionicons name="create" size={24} color="#047DB9" />)} }/> : null}
    </Tabs.Navigator>
    );

};

const CustomDrawerContent = (props) => {
  const { signOut } = useContext(AuthContext);
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{justifyContent: 'space-between'}}>
      <DrawerItemList {...props} />
      <DrawerItem label="Signout" style={{paddingVertical:480}} onPress={() => signOut() } />
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