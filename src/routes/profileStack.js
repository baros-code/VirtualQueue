import { createStackNavigator } from 'react-navigation-stack';
import Profile from '../ProfileScreen';

const screens = {
  Profile: {
    screen: Profile,
    navigationOptions: {
      title: 'Account Settings'
    },
  },
}

const ProfileStack = createStackNavigator(screens, {
  defaultNavigationOptions: {
    headerTintColor: '#444',
    headerStyle: { backgroundColor: '#eee', height: 60 },
  }
});

export default ProfileStack;
