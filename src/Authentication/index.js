import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import LoginScreen from './LoginScreen'
import RegistrationScreen from "./RegistrationScreen"
import HomeScreen from "./HomeScreen"
import phoneAuthentication from "./PhoneAuthentication"

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
  
