/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button } from 'galio-framework';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Input } from 'react-native-elements';
import { AppStyles } from '../../common/appStyle';
import Icon from 'react-native-vector-icons/FontAwesome';
import { argonTheme } from '../../common/argon_constants';
import { getData, postData } from '../../common/fetchData';
import { showMessage } from 'react-native-flash-message';

export default class EditProfile extends Component {

  constructor(props) {
    super(props);
    this.state = {
      editUser: {
        firstName: null,
        lastName: null,
        age: null,
        address: null,
      },
    };
  }

  onChangeInputText = (key, value) => {
    const userData = this.state.editUser;
    userData[key] = value;
    this.setState({ userData });
  }

  onCloseEditModal = () => {
    const data = {
      firstName: null,
      lastName: null,
      age: null,
      address: null,
    };
    this.setState({ editUser: data });
  }

  saveEditProfileHandler = async () => {
    try {
      const body = this.state.editUser;
      Object.keys(body).map((item) => !body[item] && delete body[item]);
      const response = await postData('/api/v2/u/profile', body, 'PUT');
      if (response.error) {
        return showMessage({ message: response.msg, type: 'danger' });
      }
      const { msg } = response;
      this.props.updateUserInfo(body);
      showMessage({ message: msg, type: 'success' });
    } catch (error) {
      console.log('46-editProfile.jsx-', error);
    }
  }

  displayEditData = (userProfile) => {
    const { firstName, lastName, address } = this.state.editUser;
    return (
      <React.Fragment>
        <View style={styles.headerStyle}><Text style={styles.headerText}>Edit Profile</Text></View>
        <View style={styles.InputContainer}>
          <Input
            placeholder="First Name"
            placeholderTextColor={AppStyles.color.grey}
            onChangeText={text => this.onChangeInputText('firstName', text)}
            defaultValue={userProfile.firstName}
            label="First Name"
            value={firstName}
          />
        </View>

        <View style={styles.InputContainer}>
          <Input
            placeholder="last Name"
            placeholderTextColor={AppStyles.color.grey}
            onChangeText={text => this.onChangeInputText('lastName', text)}
            value={lastName}
            defaultValue={userProfile.lastName}
            label="Last Name"
          />
        </View>

        {/* <View style={styles.InputContainer}>
          <Input
            placeholder="address"
            placeholderTextColor={AppStyles.color.grey}
            onChangeText={text => this.onChangeInputText('address', text)}
            value={address}
            defaultValue={userProfile.address}
            label="Address"
          />
        </View> */}

        <Button small style={{ backgroundColor: AppStyles.color.primary, marginTop: 30 }} onPress={this.saveEditProfileHandler} >
          Save
        </Button>
      </React.Fragment>
    );
  }

  render() {
    const { setEditModalRef, userProfile } = this.props;
    return (
      <React.Fragment>
        <View>
          <RBSheet
            ref={setEditModalRef}
            height={400}
            onClose={this.onCloseEditModal}
            openDuration={250}
            customStyles={{
              container: {
                justifyContent: 'center',
                alignItems: 'center',
              },
            }}>
            {this.displayEditData(userProfile)}
          </RBSheet>
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
  inputLeftIcon: {
    marginRight: 20,
  },
  headerStyle: {
    width: AppStyles.textInputWidth.main,
    marginTop: -50,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 22,
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

});
