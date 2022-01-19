/* eslint-disable prettier/prettier */
import React, { Component } from 'react'
import OneSignal from 'react-native-onesignal';

export default class OneSignalPushNotify extends Component {
  constructor(props) {
    super(props);
    OneSignal.setLogLevel(6, 0);
    OneSignal.setAppId("2c8a9a82-c69a-465b-9c01-b4de87d477c6");
    OneSignal.addEventListener('received', this.onRecieveNotification);
    console.log('constructor in app');
  }

  onRecieveNotification = (notification) => {
    console.log('=============== notify = ', notification);
  }

  render() {
    return null;
  }
}