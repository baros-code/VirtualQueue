import { createStackNavigator } from 'react-navigation-stack';
import ClientDashboard from '../Client/ClientDashboard';
import Services from '../Client/Services';
import Organizations from '../Client/Organizations';
import CreateReservation from '../Client/CreateReservation';
import ReservationDetails from '../Client/ReservationDetails';

const screens = {
  Home: {
    screen: ClientDashboard,
    navigationOptions: {
      title: 'Hello',
    }
  },
  Services: {
      screen: Services,
      navigationOptions: {
          title: 'Choose a Service'
      }
  },
  Organizations: {
      screen: Organizations,
      navigationOptions: {
          title: 'Choose an Organization'
      }
  },
  CreateReservation: {
    screen: CreateReservation,
    navigationOptions: {
      title: 'Create a Reservation',
    }
  },
  ReservationDetails: {
      screen: ReservationDetails,
      navigationOptions: {
          title: 'Reservation Details'
      }
  }
};

// home stack navigator screens
const HomeStack = createStackNavigator(screens, {
  defaultNavigationOptions: {
    headerTintColor: '#444',
    headerStyle: { backgroundColor: '#eee', height: 60 }
  }
});

export default HomeStack;