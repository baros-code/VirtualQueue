import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import { Provider as OrganizationProvider } from './src/context/OrganizationContext'

import LoginScreen from './src/Authentication/LoginScreen'
import HomeScreen from './src/Authentication/HomeScreen'
import RegistrationScreen from './src/Authentication/RegistrationScreen'
import PhoneVerification from './src/Authentication/PhoneAuthentication'

import ClientDashboard from './src/Client/ClientDashboard';
import CreateReservation from './src/Client/CreateReservation';
import ReservationDetails from './src/Client/ReservationDetails';
import Organizations from './src/Client/Organizations';

import AdminDashboard from './src/Admin/AdminDashboard';
import QueueForm from './src/Admin/QueueForm';
import QueueDetails from './src/Admin/QueueDetails';
import EditQueue from './src/Admin/EditQueue';

import EmployeeDashboard from './src/screens/EmployeeDashboard';
import ListClients from './src/screens/ListClients';
import ClientDetails from './src/screens/ClientDetails';


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
        title:"Create Queue",
      }
    },
    QueueDetails: QueueDetails,
    EditQueue: EditQueue,
    EmployeeDashboard: EmployeeDashboard,
    ListClients : ListClients,
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
    PhoneVerification: PhoneVerification
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
      <OrganizationProvider>
            <App />
     </OrganizationProvider>
  
  )
};








