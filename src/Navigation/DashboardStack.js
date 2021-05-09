
import { createStackNavigator } from 'react-navigation-stack'
import HomeScreen from '../Authentication/HomeScreen'

const screens = {
    Dashboard: {
        screen: HomeScreen,
        navigationOptions: {
          title:"Dashboard"
          }
      },
    }

const DashboardStack=createStackNavigator(screens,{defaultNavigationOptions: {
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
  
export default DashboardStack