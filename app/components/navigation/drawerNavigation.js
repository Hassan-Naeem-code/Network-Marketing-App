/* eslint-disable prettier/prettier */
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import CustomDrawerContentComponent from './customDrawer';
import { NavigationNativeContainer } from '@react-navigation/native';
import React, { Component } from 'react';
import { View, Text, Left } from 'native-base';
import Home from '../screens/Home/index';
import Network from '../screens/network/index';



const drawer = createDrawerNavigator(
  {
    home: { screen: Home },
    network: { screen: Network },
    // refuelPage: { screen: RefuelPage },
    // cameraPage: { screen: CameraStatusPage },

    // login: { screen: HeaderMain }
  },
  {
    initialRouteName: 'home',
    contentComponent: CustomDrawerContentComponent,
    contentOptions: {
      activeTintColor: '#e91e63',
      activeBackgroundColor: '#a7f2ac',
    },
    drawerWidth: 300,
    drawerPosition: Left,
  },
);

const AppContain = createAppContainer(drawer);
export default class DrawerNavigator extends Component {
  constructor() {
    super();

    this.state = {
      user: '',
    };
  }

  static navigationOptions = {
    headerShow: null,
    // drawerLabel: "Home",
    // drawerIcon: () => <Icon name="menu" color="#fff"></Icon>
  };
  render() {
    const params = this.props.navigation.getParam('checked', 'Peter');
    return (
      <AppContain
        screenProps={{
          switchNavigation: this.props.navigation,
          checkedStatus: params,
        }}
      />
    );
  }
}
// export default function NavigateDrawer() {
// return (
// <React.Fragment>

/* <NavigationNativeContainer> */

/* </NavigationNativeContainer> */
/* </React.Fragment> */
// );
// }
