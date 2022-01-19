/* eslint-disable prettier/prettier */

import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import Button from 'react-native-button';
import { AppStyles } from '../../common/appStyle';
import { postData } from '../../common/fetchData';
import { showMessage } from "react-native-flash-message";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUserInfo, startPageLoader } from '../../redux/actions';
import { connect } from 'react-redux';
import { Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import NumberVerify from './verify-number';
import TopHeader from '../../common/header';

const themeTextInput = {
  placeholder: 'black',
  text: 'black',
  primary: 'black',
  underlineColor: 'transparent',
  background: 'white',
};

class SignupScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      newUser: {
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
        ref_code: '',
      },
      errorLogs: {
        firstName: 'First name is required',
        lastName: 'Last name is required',
        phone: 'Phone number required',
        email: 'Email required',
        password: 'Password is required',
        confirmPassword: 'Confirm password is required',
        ref_code: 'Referal code is required',
      },
    };
  }

  onChangeInputText = (value, key) => {
    let newUser = this.state.newUser;
    if (key === 'phone' && !newUser.phone.includes('+92')) {
      value = `+92${value}`;
    }
    newUser[key] = value;
    this.setState({ newUser: newUser });
  }

  validateInputFields = () => {
    const { errorLogs, newUser } = this.state;
    const keys = Object.keys(newUser);
    for (let i = 0; i < keys.length; i++) {
      const item = keys[i];
      if (!newUser[item] || newUser[item] === '') {
        return { fieldError: `${errorLogs[item]}` };
      }
    }
    return { fieldError: null };
  }

  sendOtpHandler = async (phoneNumber) => {
    try {
      const body = {
        phone: phoneNumber,
      };
      if (!phoneNumber || phoneNumber === '') {
        showMessage({ message: 'Phone Number Required', type: 'danger' });
        return false;
      }
      const response = await postData('/api/v2/u/auth/get-otp', body);

      if (response.error) {
        showMessage({ message: response.msg, type: 'danger' });
        return false;
      }
      return true;
    } catch (error) {
      console.error('77-', error);
    }
  }

  onRegister = async () => {
    try {
      const { fieldError } = this.validateInputFields();
      if (fieldError) {
        return showMessage({ message: fieldError, type: 'danger' });
      }

      const body = this.state.newUser;
      if (!body.ref_code || body.ref_code === '') {
        delete body.ref_code;
      }

      const response = await postData('/api/v2/u/auth/register', body);
      if (response.error) {
        return showMessage({ message: response.msg, type: 'danger' });
      }
      const { accessToken } = response.data;
      AsyncStorage.setItem('token', accessToken);
      showMessage({ message: response.msg, type: 'success' });
      this.props.navigation.navigate('Login');
    } catch (error) {
      console.error('48-register.jsx ', error);
    }
  };

  verifyPhoneAndRefCodeHandler = async (phoneNumber, ref_code) => {
    try {
      const body = {
        phone: phoneNumber,
        ref_code: ref_code,
      };
      const response = await postData('/api/v2/u/auth/validate_phone_refercode', body);

      if (response.error) {
        showMessage({ message: response.msg, type: 'danger' });
        return false;
      }
      return true;
    } catch (error) {
      console.error('77-', error);
    }
  }

  onNextButtonHandler = async () => {
    try {
      const { fieldError } = this.validateInputFields();
      if (fieldError) {
        return showMessage({ message: fieldError, type: 'danger' });
      }
      const { phone, ref_code } = this.state.newUser;
      this.props.setPageLoader(true);

      const isPhoneAndCodeValid = await this.verifyPhoneAndRefCodeHandler(phone, ref_code);
      if (isPhoneAndCodeValid === true) {
        this.sendOtpHandler(phone);
        this.setState({ verifyNumberForm: true });
      }
    } catch (error) {
      console.error('99-', error);
    } finally {
      this.props.setPageLoader(false);
    }
  }

  displayIcon = (name) => {
    return <Icon name={name} size={24} color={AppStyles.color.primary2} />;
  }

  closeVerifyNumberForm = () => {
    this.setState({ verifyNumberForm: false });
  }
  render() {
    const { newUser, verifyNumberForm } = this.state;
    if (verifyNumberForm) {
      return <NumberVerify
        onRegisterHandler={this.onRegister}
        newUser={newUser}
        onChangeInputText={this.onChangeInputText}
        closeVerifyNumberForm={this.closeVerifyNumberForm}
        sendOtpHandler={this.sendOtpHandler}
      />;
    }
    return (
      <React.Fragment>
        <TopHeader title="Register" navigation={this.props.navigation} keyValue="login" />

        <ScrollView>
          <View style={styles.container}>

            <View style={styles.InputContainer}>
              <Input
                placeholder="First Name"
                leftIcon={() => this.displayIcon('user')}
                placeholderTextColor={AppStyles.color.grey}
                leftIconContainerStyle={styles.inputLeftIcon}
                onChangeText={text => this.onChangeInputText(text, 'firstName')}
                value={newUser.firstName}
              />
            </View>

            <View style={styles.InputContainer}>
              <Input
                placeholder="Last Name"
                leftIcon={() => this.displayIcon('user')}
                placeholderTextColor={AppStyles.color.grey}
                leftIconContainerStyle={styles.inputLeftIcon}
                onChangeText={text => this.onChangeInputText(text, 'lastName')}
                value={newUser.lastName}
              />
            </View>

            <View style={styles.InputContainer}>
              <Input
                placeholder="Phone Number"
                leftIcon={() => this.displayIcon('phone')}
                placeholderTextColor={AppStyles.color.grey}
                leftIconContainerStyle={styles.inputLeftIcon}
                onChangeText={text => this.onChangeInputText(text, 'phone')}
                value={newUser.phone}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.InputContainer}>
              <Input
                placeholder="E-mail Address"
                leftIcon={() => this.displayIcon('envelope')}
                placeholderTextColor={AppStyles.color.grey}
                leftIconContainerStyle={styles.inputLeftIcon}
                keyboardType="email-address"
                onChangeText={text => this.onChangeInputText(text, 'email')}
                value={newUser.email}
              />
            </View>

            <View style={styles.InputContainer}>
              <Input
                placeholder="Password"
                leftIcon={() => this.displayIcon('key')}
                placeholderTextColor={AppStyles.color.grey}
                leftIconContainerStyle={styles.inputLeftIcon}
                secureTextEntry={true}
                onChangeText={text => this.onChangeInputText(text, 'password')}
                value={newUser.password}
              />
            </View>

            <View style={styles.InputContainer}>
              <Input
                placeholder="Confirm Password"
                leftIcon={() => this.displayIcon('key')}
                placeholderTextColor={AppStyles.color.grey}
                leftIconContainerStyle={styles.inputLeftIcon}
                secureTextEntry={true}
                onChangeText={text => this.onChangeInputText(text, 'confirmPassword')}
                value={newUser.confirmPassword}
              />
            </View>

            <View style={styles.InputContainer}>
              <Input
                placeholder="Referral Code"
                leftIcon={() => this.displayIcon('asterisk')}
                placeholderTextColor={AppStyles.color.grey}
                leftIconContainerStyle={styles.inputLeftIcon}
                onChangeText={text => this.onChangeInputText(text, 'ref_code')}
                value={newUser.refferalCode}
              />
            </View>

            <Button
              containerStyle={[styles.facebookContainer, { marginTop: 50 }]}
              style={styles.facebookText}
              onPress={() => this.onNextButtonHandler()}>
              Next
            </Button>
          </View>
        </ScrollView>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  inputLeftIcon: {
    marginRight: 20,
  },
  title: {
    fontSize: AppStyles.fontSize.title,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  leftTitle: {
    alignSelf: 'stretch',
    marginLeft: 20,
  },
  content: {
    paddingLeft: 50,
    paddingRight: 50,
    textAlign: 'center',
    fontSize: AppStyles.fontSize.content,
    color: AppStyles.color.text,
  },
  loginContainer: {
    width: AppStyles.buttonWidth.main,
    backgroundColor: AppStyles.color.tint,
    borderRadius: AppStyles.borderRadius.main,
    padding: 10,
    marginTop: 30,
  },
  loginText: {
    color: AppStyles.color.white,
  },
  placeholder: {
    color: 'red',
  },
  InputContainer: {
    width: AppStyles.textInputWidth.main,
    marginTop: 30,
    // borderWidth: 1,
    borderStyle: 'solid',
    borderColor: AppStyles.color.grey,
    borderRadius: AppStyles.borderRadius.main,
  },
  body: {
    height: 42,
    paddingLeft: 20,
    paddingRight: 20,
    color: AppStyles.color.text,
  },
  facebookContainer: {
    width: AppStyles.buttonWidth.main,
    backgroundColor: AppStyles.color.primary,
    // borderRadius: AppStyles.borderRadius.main,
    padding: 10,
    marginTop: 30,
    marginBottom: 10,
  },
  facebookText: {
    color: AppStyles.color.white,
  },

});


const mapDispatchToProps = (dispatch) => {
  return {
    setUserProfileData: (value) => dispatch(setUserInfo(value)),
    setPageLoader: (value) => dispatch(startPageLoader(value)),
  };
};
export default connect(null, mapDispatchToProps)(SignupScreen);
