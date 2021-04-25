import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import LoginScreen from './LoginScreen/LoginScreen'
import RegistrationScreen from "./RegistrationScreen/RegistrationScreen"
import HomeScreen from "./HomeScreen/HomeScreen"

// create screens
const screens = {
    Login: {
        screen:LoginScreen
    },
    Home: {
      screen: HomeScreen
    },
    Register: {
      screen: RegistrationScreen
    }
  
  }


  
  const Stack = createStackNavigator(screens, {
    defaultNavigationOptions: {
        gestureEnabled:false,
        headerTintColor:"white",
        headerStyle: {
             backgroundColor:"#0e66d4",
             
        }
  } });

  export default createAppContainer(Stack)
  
