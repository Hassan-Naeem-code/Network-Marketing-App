/* eslint-disable prettier/prettier */
/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
import { DrawerItems, SafeAreaView } from 'react-navigation';
// import {DrawerActions} from 'react-navigation-drawer';
import { Divider, Avatar, Icon } from 'react-native-elements';
import React, { Component } from 'react';
import ColorPalette from 'react-native-color-palette';
// https://snack.expo.io/@react-navigation/auth-flow-v3

import {
  StyleSheet,
  Text,
  View,
  TouchableNativeFeedback,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DefaultDrawer = props => (
  <ScrollView>
    <SafeAreaView style={styles.container}>
      <DrawerItems {...props} />
    </SafeAreaView>
  </ScrollView>
);

class CustomDrawerContentComponent extends Component {
  constructor() {
    super();

    this.state = {
      user: [],
      isLoading: true,
      checkedStatus: '',
    };
  }
  componentDidMount() {
    this._getUserData();
  }

  _getUserData = async () => {
    try {
      let userData = await AsyncStorage.getItem('userData');
      let checkedStatus = await AsyncStorage.getItem('checkedStatus');

      if (userData !== undefined && userData !== null) {
        userData = JSON.parse(userData);
        let user = this.state.user;
        user.push(userData);
        this.setState({
          user: user,
          isLoading: false,
          checkedStatus: checkedStatus,
        });
      }
    } catch (e) {
      alert('Error#1000  ' + e);
    }
  };

  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.screenProps.switchNavigation.navigate('Auth');
  };
  addItemAndIcon = (iname, tname, activeRoute) => {
    return (
      <View
        style={[styles.itemView, activeRoute === true ? styles.active : null]}>
        <Icon
          name={iname}
          size={22}
          color="blue"
          containerStyle={{ marginRight: '10%' }}
        />
        <Text style={styles.itemText}>{tname}</Text>
      </View>
    );
  };

  render() {
    let routeIndex = this.props.navigation.state.index;
    let currentScreen =
      this.props.navigation.state.routes[routeIndex].routeName;
    const { theme, user } = this.props;
    const ripple = TouchableNativeFeedback.Ripple('#adacac', false);

    return (
      <View style={{ flex: 1 }}>
        <ScrollView>
          <SafeAreaView
            style={styles.container}
            forceInset={{ top: 'always', horizontal: 'never' }}>
            <View
              style={[styles.containHeader, { backgroundColor: '#0a3002' }]}>
              {/* <TouchableNativeFeedback onPress={()=>this.props.navigation.dispatch(DrawerActions.closeDrawer())}>
                  <Icon name="menu" size={22} color="white" containerStyle={{ paddingRight: "90%" }}>
                  </Icon>
                </TouchableNativeFeedback> */}
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Avatar
                  size="large"
                  source={require('../../assets/images/profile.jpg')}
                  containerStyle={{ marginTop: 2 }}
                  rounded
                  icon={{
                    name: 'user-circle-o',
                    type: 'font-awesome',
                    size: 80,
                  }}
                />
                <Text
                  style={{
                    color: 'white',
                    marginTop: '3%',
                    fontFamily: 'sans-serif-condensed',
                  }}>
                  {'Nafix'}
                </Text>
                <Text
                  style={{
                    color: '#f9f9f9',
                    fontFamily: 'sans-serif-condensed',
                  }}>
                  {'mn36505@gmail.com'}
                </Text>
              </View>
            </View>

            {/* <DrawerItems {...this.props} /> */}

            <View>
              <View style={{ marginTop: '2%' }}>
                <Divider style={{ backgroundColor: '#777f7c90' }} />
              </View>

              {/* Start  Drawer  Items  */}
              <View style={{ marginTop: '3%' }}>
                <TouchableNativeFeedback
                  title="home"
                  onPress={() => this.props.navigation.navigate('home')}>
                  {currentScreen === 'home'
                    ? this.addItemAndIcon('home', 'Home', true)
                    : this.addItemAndIcon('home', 'Home', false)}
                </TouchableNativeFeedback>
                <TouchableNativeFeedback
                  title="stealPage"
                  onPress={() => this.props.navigation.navigate('network')}>
                  {currentScreen === 'network'
                    ? this.addItemAndIcon('history', 'Network', true)
                    : this.addItemAndIcon(
                      'history',
                      'Network',
                      false,
                    )}
                </TouchableNativeFeedback>
                <TouchableNativeFeedback
                  title="refuelPage"
                  onPress={() =>
                    this.props.navigation.navigate('refuelPage')
                  }>
                  {currentScreen === 'refuelPage'
                    ? this.addItemAndIcon(
                      'history',
                      'Refueling History',
                      true,
                    )
                    : this.addItemAndIcon(
                      'history',
                      'Refueling History',
                      false,
                    )}
                </TouchableNativeFeedback>
                {this.state.checkedStatus === 'admin' ? (
                  <TouchableNativeFeedback
                    title="cameraPage"
                    onPress={() =>
                      this.props.navigation.navigate('cameraPage')
                    }>
                    {currentScreen === 'cameraPage'
                      ? this.addItemAndIcon(
                        'visibility',
                        'Camera Status',
                        true,
                      )
                      : this.addItemAndIcon(
                        'visibility',
                        'Camera Status',
                        false,
                      )}
                  </TouchableNativeFeedback>
                ) : null}
              </View>
              {/* End Drawer Items */}
            </View>
          </SafeAreaView>
        </ScrollView>

        <View
          elevation={6}
          style={{ backgroundColor: '#ffffff', paddingBottom: '2%' }}>
          <TouchableNativeFeedback
            background={ripple}
            title="Logout"
            onPress={this._signOutAsync}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingLeft: '1%',
              }}>
              <Icon
                name="logout"
                type="simple-line-icon"
                size={20}
                color="blue"
                containerStyle={{ marginRight: '10%' }}
              />
              <Text
                style={{
                  color: 'black',
                  fontFamily: 'sans-serif-medium',
                  paddingBottom: '2%',
                  fontSize: 18,
                }}>
                Logout
              </Text>
            </View>
          </TouchableNativeFeedback>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  itemView: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: '3.5%',
  },
  itemText: {
    color: 'black',
    fontFamily: 'sans-serif-medium',
    paddingBottom: '2%',
    fontSize: 16,
  },
  active: {
    backgroundColor: '#a7f2ac',
  },
});
export default CustomDrawerContentComponent;
