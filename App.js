import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import { Provider as ReservationProvider } from './src/context/ReservationContext'
import { Provider as QueueProvider } from './src/context/QueueContext'
import { Provider as OrganizationProvider } from './src/context/OrganizationContext'
import { Provider as AuthProvider } from './src/context/AuthContext'

import ClientDashboard from './src/screens/ClientDashboard';
import CreateReservation from './src/screens/CreateReservation';
import ReservationDetails from './src/screens/ReservationDetails';
import Organizations from './src/screens/Organizations';

import AdminDashboard from './src/screens/AdminDashboard';
import CreateQueue from './src/screens/CreateQueue';
import QueueDetails from './src/screens/QueueDetails';
import EditQueue from './src/screens/EditQueue';

import EmployeeDashboard from './src/screens/EmployeeDashboard';
import ListClients from './src/screens/ListClients';
import ClientDetails from './src/screens/ClientDetails';

//denemeeeeee

const navigator = createStackNavigator(

  {
    ClientDashboard: ClientDashboard,
    CreateReservation : CreateReservation,
    Details: ReservationDetails,
    Organizations: Organizations,
    AdminDashboard: AdminDashboard,
    CreateQueue: CreateQueue,
    QueueDetails: QueueDetails,
    EditQueue: EditQueue,
    EmployeeDashboard: EmployeeDashboard,
    ListClients : ListClients,
    ClientDetails: ClientDetails,
  },

  {
    initialRouteName: 'ClientDashboard',
    defaultNavigationOptions: {
      headerMode: 'screen',
      cardStyle: { backgroundColor: '#047DB9'},
      headerStyle: { backgroundColor: '#047DB9'},
    },
  }

);

const App = createAppContainer(navigator);

export default () => {
  return (
    <QueueProvider>
      <OrganizationProvider>
        <ReservationProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
       </ReservationProvider>
    </OrganizationProvider>
  </QueueProvider>
  )
};










