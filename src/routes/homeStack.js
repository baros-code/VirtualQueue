import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';


import LoginScreen from '../Authentication/LoginScreen'
import RegistrationScreen from '../Authentication/RegistrationScreen'
import PhoneAuthentication from '../Authentication/PhoneAuthentication'

import ClientDashboard from '../Client/ClientDashboard';
import Services from '../Client/Services';
import Organizations from '../Client/Organizations';
import CreateReservation from '../Client/CreateReservation';
import ReservationDetails from '../Client/ReservationDetails';


const HomeStack = createStackNavigator();

export default function myStacks() {
  return (
    <HomeStack.Navigator initialRouteName="Login" headerMode="screen">
      <HomeStack.Screen name="Login" component={LoginScreen} />
      <HomeStack.Screen name="Register" component={RegistrationScreen} />
      <HomeStack.Screen name="PhoneVerification" component={PhoneAuthentication} />

      <HomeStack.Screen name="ClientDashboard" component={ClientDashboard} />
      <HomeStack.Screen name="Services" component={Services} />
      <HomeStack.Screen name="Organizations" component={Organizations} />
      <HomeStack.Screen name="CreateReservation" component={CreateReservation} />
      <HomeStack.Screen name="ReservationDetails" component={ReservationDetails} />
    </HomeStack.Navigator>
  );
}





// const screens = {
//     Home: {
//       screen: ClientDashboard,
//       navigationOptions: {
//         title: 'Hello',
//       }
//     },
//     Services: {
//         screen: Services,
//         navigationOptions: {
//             title: 'Choose a Service'
//         }
//     },
//     Organizations: {
//         screen: Organizations,
//         navigationOptions: {
//             title: 'Choose an Organization'
//         }
//     },
//     CreateReservation: {
//       screen: CreateReservation,
//       navigationOptions: {
//         title: 'Create a Reservation',
//       }
//     },
//     ReservationDetails: {
//         screen: ReservationDetails,
//         navigationOptions: {
//             title: 'Reservation Details'
//         }
//     }
//   };