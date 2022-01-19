/* eslint-disable prettier/prettier */
import React from 'react';
import Button from 'react-native-button';
import { Text, View, StyleSheet, ImageBackground, Dimensions, Image } from 'react-native';
import { AppStyles } from '../common/appStyle';
import { ActivityIndicator } from 'react-native';
import COVER_IMG from '../assets/imgs/welcome_001.png';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Block } from 'galio-framework';

const { width, height } = Dimensions.get('screen');

class WelcomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };
  }

  render() {
    if (this.state.isLoading === false) {
      return (
        <ActivityIndicator
          style={styles.spinner}
          size="large"
          color={AppStyles.color.tint}
        />
      );
    }
    return (
      <React.Fragment>
        <ImageBackground source={COVER_IMG} imageStyle={styles.profileBackground} style={styles.profileContainer}>

          <Block style={[styles.containerFirst]} >
            <Block space="evenly">
              <Image source={require('../assets/imgs/applogo.png')} style={styles.imageLogo} resizeMode="contain" />
            </Block>
            <Block space="evenly" style={styles.aboutInfoIcon}>
              <Icon name="info-circle" size={28} color={AppStyles.color.primary} />
            </Block>
          </Block>

          <View style={[styles.containerSecond]}>
            <Text style={styles.sloganText1}>Let's <Text style={{ color: AppStyles.color.primary2 }}>Start !</Text></Text>
            <Text style={styles.sloganText}>Refer to your social circle to  gagner upto million</Text>
          </View>

          <View style={[styles.containerThird]}>
            <Button
              containerStyle={styles.loginContainer}
              style={styles.loginText}
              onPress={() => this.props.navigation.navigate('Login')}>
              Log In
            </Button>
            <Button
              containerStyle={styles.signupContainer}
              style={styles.signupText}
              onPress={() => this.props.navigation.navigate('Signup')}>
              Sign Up
            </Button>
          </View>
        </ImageBackground>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  sloganText1: {
    padding: 16,
    fontFamily: 'Avenir-Black',
    fontSize: 32,
    fontWeight: 'bold',
    color: AppStyles.color.primary,
  },
  aboutInfoIcon: {
    marginLeft: 'auto',
    paddingRight: 20,
  },
  sloganText: {
    padding: 16,
    fontFamily: 'American Typewriter',
    fontSize: 16,
    fontWeight: 'bold',
    color: AppStyles.color.primary,
  },
  imageLogo: {
    width: 230,
    height: 150,
  },
  containerFirst: {
    // backgroundColor: 'red',
    flexDirection: 'row',
    flexWrap: 'wrap'
    // flex: 1,
  },
  containerSecond: {
    textAlign: 'center',
    flex: 1,
  },
  containerThird: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '-1%',
    flex: 1,
  },
  logo: {
    width: width,
    height: 200,
  },
  profileContainer: {
    width: width,
    height: height,
    padding: 0,
    zIndex: 1,
  },
  title: {
    fontSize: AppStyles.fontSize.title,
    fontWeight: 'bold',
    color: AppStyles.color.primary2,
    marginTop: 20,
    textAlign: 'center',
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  loginContainer: {
    width: AppStyles.buttonWidth.main,
    backgroundColor: AppStyles.color.primary2,
    borderRadius: AppStyles.borderRadius.main,
    padding: 10,
    marginTop: 30,
  },
  loginText: {
    color: AppStyles.color.white,
  },
  signupContainer: {
    width: AppStyles.buttonWidth.main,
    backgroundColor: AppStyles.color.white,
    borderRadius: AppStyles.borderRadius.main,
    padding: 8,
    borderWidth: 1,
    borderColor: AppStyles.color.primary2,
    marginTop: 15,
  },
  signupText: {
    color: AppStyles.color.primary2,
  },
  spinner: {
    marginTop: 200,
  },
});

export default WelcomeScreen;
