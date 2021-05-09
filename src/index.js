import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import LoginScreen from './Authentication/LoginScreen'
import RegistrationScreen from "./Authentication/RegistrationScreen"
import HomeScreen from "./Authentication/HomeScreen"
import phoneAuthentication from "./Authentication/PhoneAuthentication"
import AdminDashboard from "./Admin/AdminDashboard"
// create screens
const screens = {
    Login: {
        screen:LoginScreen,
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
    Register: {
      screen: RegistrationScreen
    },

    PhoneVerification: {
      screen: phoneAuthentication,
      navigationOptions: {
        title:"Phone Verification"
        }
    },
    AdminDashboard: {
      screen: AdminDashboard,
      navigationOptions: {
        title:"Dashboard",
        }
    }
  
  }

  const Stack = createStackNavigator(screens, {
    defaultNavigationOptions: {
        headerTintColor:"#0e66d4",
        headerStyle: {
             backgroundColor:"white",
             
        }
  } });

  export default createAppContainer(Stack)
  
