/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable prettier/prettier */

import {createDrawerNavigator} from 'react-navigation-drawer';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Login from '../screens/auth/login';
import DrawerNavigator from '../navigation/drawerNavigation';
import AuthLoadingScreen from './authLoading';
import WelcomeScreen from '../screens/welcome';
import SignupScreen from '../screens/auth/signup';
import NumberVerifyScreen from '../screens/auth/verify-number';
import BottomNavigation from './bottomNavigation';

// const AppStack = createStackNavigator(
//   { dawer: DrawerNavigator },
//   {
//     headerMode: 'none',
//     navigationOptions: {
//       headerVisible: false,
//       header: null,
//     },
//   }
// );

const AuthStack = createStackNavigator(
  {
    SignIn: {screen: WelcomeScreen},
    Login: {screen: Login},
    Signup: {screen: SignupScreen},
    NumberVerify: {screen: NumberVerifyScreen},
  },
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
      header: null,
    },
  },
);

const NavStack = createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: BottomNavigation,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  },
);
const Nav = createAppContainer(NavStack);
export default Nav;
