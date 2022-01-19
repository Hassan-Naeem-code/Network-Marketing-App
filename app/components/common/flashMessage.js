/* eslint-disable prettier/prettier */
import React from "react";
import { View } from "react-native";
import FlashMessage from "react-native-flash-message";

export default class FlashPopup extends React.Component {
  render() {
    return (
      <FlashMessage position="top" />
    );
  }
}