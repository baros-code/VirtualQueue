import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import LoginScreen from './LoginScreen/LoginScreen'
import RegistrationScreen from "./RegistrationScreen/RegistrationScreen"
import HomeScreen from "./HomeScreen/HomeScreen"

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
  
