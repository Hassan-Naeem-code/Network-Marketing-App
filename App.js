/* eslint-disable prettier/prettier */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type { Node } from 'react';

import Nav from './app/components/navigation/navigation';
import FlashPopup from './app/components/common/flashMessage'
import { combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';
import { userInfoReducer, fetchLoaderStatus } from './app/components/redux/reducer';
import Loader from './app/components/common/lazyloader';
import BottomNavigation from './app/components/navigation/bottomNavigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SafeAreaView } from 'react-native';
import OneSignalPushNotify from './app/thirdParty/signal/index';
import OneSignal from 'react-native-onesignal';



const allReducer = combineReducers({
  userInfo: userInfoReducer,
  fetchLoader: fetchLoaderStatus,
});

const userDetails = createStore(allReducer);

const App: () => Node = () => {
  OneSignal.setLogLevel(6, 0);
  OneSignal.setAppId("2c8a9a82-c69a-465b-9c01-b4de87d477c6");
  OneSignal.setNotificationWillShowInForegroundHandler((notificationReceivedEvent) => {
    console.log("OneSignal: notification will show in foreground:", notificationReceivedEvent)
  })

  const onRecieveNotification = () => {
  }
  return (
    <React.Fragment>
      <SafeAreaProvider>
        <Provider store={userDetails}>
          <Nav />
          <Loader />
          <FlashPopup />
        </Provider>
      </SafeAreaProvider>
    </React.Fragment>
  );
};


export default App;
