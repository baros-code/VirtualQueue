import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';


import LoginScreen from './src/Authentication/LoginScreen'
import HomeScreen from './src/Authentication/HomeScreen'
import RegistrationScreen from './src/Authentication/RegistrationScreen'
import PhoneVerification from './src/Authentication/PhoneAuthentication'

import ClientDashboard from './src/Client/ClientDashboard';
import CreateReservation from './src/Client/CreateReservation';
import ReservationDetails from './src/Client/ReservationDetails';
import Organizations from './src/Client/Organizations';
import Services from './src/Client/Services';

import AdminDashboard from './src/Admin/AdminDashboard';
import QueueForm from './src/Admin/QueueForm';
import EditQueue from './src/Admin/EditQueue';

import EmployeeDashboard from './src/Employee/EmployeeDashboard';
import ListClients from './src/Employee/ListClients';
import ClientDetails from './src/Employee/ClientDetails';
import EmployeeMyQueues from './src/Employee/MyQueues';



const navigator = createStackNavigator(

  {
    ClientDashboard: ClientDashboard,
    CreateReservation : CreateReservation,
    Details: ReservationDetails,
    Organizations: Organizations,
    AdminDashboard: AdminDashboard,
    QueueForm: {
      screen:QueueForm,
      navigationOptions: {
        title:"Queue Settings",
      }
    },
    EditQueue: EditQueue,
    EmployeeDashboard: EmployeeDashboard,
    ListClients : {
      screen: ListClients,
      navigationOptions: {
        title: "Customers in the line"
      }
    },
    ClientDetails: ClientDetails,
    Login : {
      screen: LoginScreen,
      navigationOptions: {
      title:"Virtual Queue"
      }
  },
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        title:"Dashboard"
        }
    },
    Register: RegistrationScreen,
    PhoneVerification: PhoneVerification,
    Services: {
      screen: Services,
      navigationOptions: {
        title: "Choose a service"
      }
    },
    EmployeeMyQueues: {
      screen: EmployeeMyQueues,
      navigationOptions: {
        title: "My Queues"
      }
    }
  },

  {
    initialRouteName: 'Login',
    defaultNavigationOptions: {
      headerMode: 'screen',
      headerTintColor:"#0e66d4",
      cardStyle: {
        backgroundColor:"#0e66d4"
      },
      headerStyle: {
           backgroundColor:"white",
    },
  }
}

);


const App = createAppContainer(navigator);

export default () => {
  return (
        <App />
  )
};








