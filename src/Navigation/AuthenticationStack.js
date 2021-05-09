
import { createStackNavigator } from 'react-navigation-stack'
import LoginScreen from '../Authentication/LoginScreen'
import RegistrationScreen from "../Authentication/RegistrationScreen"
import phoneAuthentication from "../Authentication/PhoneAuthentication"

const screens = {
    Login: {
        screen:LoginScreen,
        navigationOptions: {
        title:"Virtual Queue"
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
    }

const AuthenticationStack=createStackNavigator(screens,{defaultNavigationOptions: {
    headerMode: 'screen',
    headerTintColor:"#0e66d4",
    cardStyle: {
      backgroundColor:"#0e66d4"
    },
    headerStyle: {
         backgroundColor:"white",
  },
}
})
  
export default AuthenticationStack