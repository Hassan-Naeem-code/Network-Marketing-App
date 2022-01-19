/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Button from 'react-native-button';
import { AppStyles } from '../../common/appStyle';
import { postData } from '../../common/fetchData';
import { showMessage } from 'react-native-flash-message';
import OTPTextInput from 'react-native-otp-textinput';
import { Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { setUserInfo, startPageLoader } from '../../redux/actions';
import { connect } from 'react-redux';
// const themeTextInput = {
//   placeholder: 'black',
//   text: 'black',
//   primary: 'black',
//   underlineColor: 'transparent',
//   background: 'white',
// };

let x = null;

class NumberVerify extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      phone: '',
      isNumberDisable: true,
      otpTimer: 5,
      disableSubmitBtn: true,
      goBackBtnDisable: true,
    };
  }

  componentDidMount = () => {
    this.startTimerHandler(true);
  }

  startTimerHandler = (onlyTimer) => {
    if (!onlyTimer) {
      this.props.sendOtpHandler();
    }
    this.setState({ otpTimer: 5, isNumberDisable: true });
    x = setInterval(() => {
      const otpTimer = this.state.otpTimer;
      if (otpTimer === 0) {
        clearInterval(x);
      }
      if (otpTimer > 0) {
        this.setState({ otpTimer: otpTimer - 1 });
      }
    }, 1000);
  }

  onPressSumbitBtnHandler = async () => {
    try {
      const { onRegisterHandler, setPageLoader } = this.props;
      setPageLoader(true);
      const isOtpVerified = await this.onPressVerifyOtp();
      if (isOtpVerified === true) {
        onRegisterHandler();
      }
    } catch (error) {
      console.error('66', error);
    } finally {
      this.props.setPageLoader(false);
    }
  }

  onPressVerifyOtp = async () => {
    try {
      const body = {
        user_otp_code: Number(this.state.userOtpCode),
        phone: this.props.newUser.phone,
      };

      const response = await postData('/api/v2/u/auth/verify-otp', body);
      if (response.error) {
        showMessage({ message: response.msg, type: 'danger' });
        return;
      }
      return true;
    } catch (error) {
      console.error('47-', error);
    }

  };

  otpCodeInputHandler = (text) => {
    this.setState({ userOtpCode: text });
    if (text.length === 4) {
      this.setState({ disableSubmitBtn: false });
    }
    if (text.length < 4 && !this.state.disableSubmitBtn) {
      this.setState({ disableSubmitBtn: true });
    }
  }
  render() {
    const { newUser, onChangeInputText, closeVerifyNumberForm } = this.props;
    const { isNumberDisable, otpTimer, disableSubmitBtn, goBackBtnDisable } = this.state;
    return (
      <React.Fragment>
        <View style={{ backgroundColor: 'teal', flexDirection: 'row' }}>
          <Icon style={{ padding: 10, marginTop: 14 }} name="home" size={24} color="white"
            onPress={() => this.props.navigation.navigate('SignIn')}
          />
          <Text style={[styles.title, styles.leftTitle]}>Create New Account</Text>
        </View>

        <View style={styles.container}>
          <View style={styles.InputContainer}>
            <Input
              containerStyle={styles.phoneInputField}
              placeholder="Phone Number"
              // leftIcon={<Icon name="phone" size={24} color="black" />}
              rightIcon={<Icon name="edit" size={24} color="black"
                onPress={() => this.setState({ isNumberDisable: false })}
              />}
              placeholderTextColor={AppStyles.color.grey}
              leftIconContainerStyle={styles.inputLeftIcon}
              onChangeText={text => onChangeInputText(text, 'phone')}
              value={newUser.phone}
              keyboardType="phone-pad"
              inputContainerStyle={{ borderBottomWidth: 0 }}
              disabled={isNumberDisable}
            />
          </View>
          <Text style={styles.verifyTitle}>Verify Your Number</Text>
          <View style={{ marginTop: 20 }}>
            <Text>Enter 4 digit code below</Text>
            <OTPTextInput ref={e => (this.otp_code_ref = e)} handleTextChange={(text) => this.otpCodeInputHandler(text)} />
          </View>

          <View style={styles.optTimerAndResentView}>
            {otpTimer === 0 ?
              <Button style={{ color: 'teal' }} onPress={this.startTimerHandler}>Resend</Button>
              :
              <Text style={{ textAlign: 'right' }}>
                {otpTimer > 9 ? `Time left: 00:${otpTimer}` : `Time left: 00:0${otpTimer}`}
              </Text>
            }

          </View>
          <Button
            containerStyle={styles.loginContainer}
            style={styles.loginText}
            onPress={() => this.onPressSumbitBtnHandler()}
            disabled={disableSubmitBtn}
            disabledContainerStyle={{ backgroundColor: 'lightgrey' }}
          >
            Submit
          </Button>
          <Button
            containerStyle={styles.previousButton}
            style={styles.loginText}
            onPress={closeVerifyNumberForm}
            disabled={otpTimer > 0 ? true : false}
            disabledContainerStyle={{ backgroundColor: 'lightgrey' }}
          >
            Go Back
          </Button>
        </View>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  optTimerAndResentView: {
    borderStyle: 'solid',
    overflow: 'hidden',
    marginBottom: 10,
    marginTop: 10,
    padding: 10,
    // borderWidth: 2,
    // borderColor: 'grey',
    width: AppStyles.buttonWidth.main,
  },
  phoneInputField: {
    borderStyle: 'solid',
    overflow: 'hidden',
    marginBottom: 10,
    marginTop: 10,
    borderWidth: 2,
    borderColor: 'grey',
  },
  verifyTitle: {
    fontSize: 18,
    marginTop: 50,
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
    // borderRadius: AppStyles.borderRadius.main,
    padding: 10,
    marginTop: 30,
  },
  previousButton: {
    width: AppStyles.buttonWidth.main,
    backgroundColor: AppStyles.color.tint,
    padding: 10,
    marginTop: 10,
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
    // borderStyle: 'solid',
    // borderColor: AppStyles.color.grey,
    // borderRadius: AppStyles.borderRadius.main,
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
  inputLeftIcon: {
    marginRight: 20,
  },
});

const mapDispatchToProps = (dispatch) => {
  return {
    setUserProfileData: (value) => dispatch(setUserInfo(value)),
    setPageLoader: (value) => dispatch(startPageLoader(value)),
  };
};

export default connect(null, mapDispatchToProps)(NumberVerify);
