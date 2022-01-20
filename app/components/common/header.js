/* eslint-disable prettier/prettier */
import * as React from 'react';
import {Appbar} from 'react-native-paper';
import {StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {DrawerActions} from 'react-navigation-drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppStyles} from './appStyle';
import {takeImageUsingCamera} from './opencamera';

const TopHeader = props => {
  const {title, subtitle, keyValue, navigation, takeSlipPhoto} = props;

  const _goBack = () => navigation.goBack();

  const signOutAsync = async () => {
    await AsyncStorage.clear();
    navigation.navigate('Auth');
  };

  const displayIconsLeftIcon = () => {
    if (keyValue === 'home') {
      return (
        <Appbar.Action
          icon="menu"
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        />
      );
    } else {
      return <Appbar.BackAction onPress={_goBack} />;
    }
  };

  const displayIconsRightIcon = () => {
    if (keyValue === 'pay') {
      return (
        <Appbar.Action
          icon="camera"
          onPress={() => takeImageUsingCamera(takeSlipPhoto)}
        />
      );
    }
    if (keyValue !== 'login') {
      return <Appbar.Action icon="logout" onPress={signOutAsync} />;
    }
  };

  return (
    <Appbar.Header style={styles.headerStyle}>
      {displayIconsLeftIcon()}
      <Appbar.Content title={title} subtitle={subtitle} />
      {displayIconsRightIcon()}
    </Appbar.Header>
  );
};

export default TopHeader;

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: AppStyles.color.pageHeader,
    zIndex: 1,
  },
});
