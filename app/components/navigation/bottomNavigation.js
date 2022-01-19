/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable prettier/prettier */

import React from "react";
import { BottomNavigation, Text } from 'react-native-paper';
import Network from '../screens/network';
import Home from '../screens/Home';
import PayPage from "../screens/pay";
import WithDraw from "../screens/withdraw";
import { StyleSheet } from 'react-native';
import { AppStyles } from "../common/appStyle";

export default function BottomNavigator(props) {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'home', title: 'Home', icon: 'home' },
    { key: 'network', title: 'Network', icon: 'album' },
    { key: 'pay', title: 'Pay', icon: 'cash' },
    { key: 'withdraw', title: 'Withdraw', icon: 'rocket' },
    // { key: 'test', title: 'test', icon: 'rocket' },

  ]);

  const renderScene = ({ route, jumpTo }) => {
    switch (route.key) {
      case 'home':
        return <Home jumpTo={jumpTo} navigation={props.navigation} />;
      case 'network':
        return <Network jumpTo={jumpTo} navigation={props.navigation} />;
      case 'pay':
        return <PayPage jumpTo={jumpTo} navigation={props.navigation} />;
      case 'withdraw':
        return <WithDraw jumpTo={jumpTo} navigation={props.navigation} />;
    }
  };


  return (
    <BottomNavigation
      navigation={props.navigation}
      labeled={true}
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      barStyle={styles.bottomBgColor}
    />
  );
}

const styles = StyleSheet.create({
  bottomBgColor: {
    backgroundColor: AppStyles.color.primary,
  },
});