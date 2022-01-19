/* eslint-disable prettier/prettier */
import React from 'react';
import { StyleSheet, View, ActivityIndicator, Image, ImageBackground, Dimensions } from 'react-native';
import Button from 'react-native-button';
import { AppStyles } from '../../common/appStyle';
import { postData } from '../../common/fetchData';
import { showMessage } from "react-native-flash-message";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import TopHeader from '../../common/header';
import COVER_IMG from '../../assets/imgs/cover_001.png';
const { width, height } = Dimensions.get('screen');

class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      email: '+92',
      password: '',
    };
  }

  onPressLogin = async () => {
    try {
      const body = {
        phone: this.state.email,
        password: this.state.password,
      };
      this.setState({ loading: true });
      const response = await postData('/api/v2/u/auth/login', body);
      if (response.error) {
        this.setState({ loading: false });
        return showMessage({ message: response.msg, type: 'danger' });
      }
      const { accessToken } = response.data;
      AsyncStorage.setItem('token', accessToken);
      this.props.navigation.navigate('App');
      showMessage({ message: 'login successfully', type: 'success' });
    } catch (error) {
      this.setState({ loading: false });
      showMessage({ message: 'Network Error', type: 'danger' });
    }

  };

  render() {
    const { loading } = this.state;

    return (
      <React.Fragment>
        <TopHeader title="Login" navigation={this.props.navigation} keyValue="login" />
        <View style={styles.imgContainer}>
          <Image source={require('../../assets/imgs/applogo.png')} style={styles.imageLogo} resizeMode="contain" />
        </View>

        <ImageBackground source={COVER_IMG} imageStyle={styles.profileBackground} style={styles.profileContainer}>

          <View style={styles.container}>
            <View style={styles.InputContainer}>
              <Input
                placeholder="Phone Number"
                leftIcon={<Icon name="phone" size={24} color="black" />}
                placeholderTextColor={AppStyles.color.grey}
                leftIconContainerStyle={styles.inputLeftIcon}
                inputContainerStyle={{ borderColor: 'transparent' }}
                onChangeText={text => {
                  if (text.length === 0) text = `+92${text}`;
                  if (text.length > 13) return;
                  this.setState({ email: text });
                }}
                value={this.state.email}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.InputContainer}>
              <Input
                placeholder="Password"
                leftIcon={<Icon name="key" size={24} color="black" />}
                placeholderTextColor={AppStyles.color.grey}
                leftIconContainerStyle={styles.inputLeftIcon}
                secureTextEntry={true}
                onChangeText={text => this.setState({ password: text })}
                value={this.state.password}
                inputContainerStyle={{ borderColor: 'transparent' }}
              />
            </View>
            <Button
              containerStyle={styles.loginContainer}
              style={styles.loginText}
              onPress={() => this.onPressLogin()}
              disabled={loading}
              disabledContainerStyle={styles.disbaleLoginBtnStyle}
            >
              Log in
            </Button>
            {this.state.loading && (
              <ActivityIndicator
                style={{ marginTop: 30 }}
                size="large"
                animating={this.state.loading}
                color={AppStyles.color.tint}
              />
            )}
          </View>

        </ImageBackground>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  imgContainer: {
    alignItems: 'center',
  },
  disbaleLoginBtnStyle: {
    backgroundColor: '#cccccc',
    color: '#666666',
  },
  imageLogo: {
    width: 300,
    height: 150,
  },
  profileContainer: {
    width: width,
    height: height,
    padding: 0,
    zIndex: 1,
  },
  profileBackground: {
    width: width,
    // height: height / 1.5,
    // backgroundColor: 'red'
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  inputLeftIcon: {
    marginRight: 20,
  },
  or: {
    color: 'black',
    marginTop: 40,
    marginBottom: 10,
  },
  title: {
    fontSize: AppStyles.fontSize.title,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
    marginBottom: 20,
  },
  leftTitle: {
    alignSelf: 'stretch',
    textAlign: 'left',
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
    backgroundColor: AppStyles.color.primary,
    // borderRadius: AppStyles.borderRadius.main,
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
    borderColor: AppStyles.color.grey,
    borderRadius: AppStyles.borderRadius.main,
    borderWidth: 1,
  },
  body: {
    height: 42,
    paddingLeft: 20,
    paddingRight: 20,
    color: AppStyles.color.text,
  },
  facebookContainer: {
    width: 192,
    backgroundColor: AppStyles.color.facebook,
    borderRadius: AppStyles.borderRadius.main,
    padding: 10,
    marginTop: 30,
  },
  facebookText: {
    color: AppStyles.color.white,
  },
  googleContainer: {
    width: 192,
    height: 48,
    marginTop: 30,
  },
  googleText: {
    color: AppStyles.color.white,
  },
});

export default LoginScreen;
