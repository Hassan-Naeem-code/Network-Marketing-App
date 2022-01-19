/* eslint-disable prettier/prettier */
import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { getData, postData } from '../../common/fetchData';
import { showMessage, hideMessage } from 'react-native-flash-message';
import { connect } from 'react-redux';
import { setUserInfo, startPageLoader } from '../../redux/actions';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Block, Text } from 'galio-framework';
import TopHeader from '../../common/header';
import { List, Button, TouchableRipple, Avatar } from 'react-native-paper';
import jazzcashLogo from '../../assets/imgs/jazzcash.jpg';
import easypaisaLogo from '../../assets/imgs/easypaisa.jpg';
import meezan from '../../assets/imgs/meezanbank.jpg';

import { AppStyles } from '../../common/appStyle';
import { openImageGalley } from '../../common/opencamera';
import { converImageToBuffer, convertImageToBase64 } from '../../common/utils';

class PayPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      paymentMethod: [
        { title: 'jazzcash', number: '+92-306-5599447' },
        { title: 'easypaisa', number: '+92-311-8219348' },
      ],
    };
  }


  displayPaymentMethod = (paymentMethod) => {
    if (!paymentMethod) { return null; }
    return paymentMethod[0].phone.map((item, index) => {
      return (
        <List.Item
          key={index}
          title={item.number}
          left={(props) => <Avatar.Image size={30} style={styles.avatarStyle} source={{ uri: item.icon }} {...props} />}
          description={item.accountTitle}
        />
      );
    });
  }

  submitSlip = async (slip) => {
    try {
      const bufferedImg = await convertImageToBase64(slip.uri);
      slip.buffer = bufferedImg;
      slip.mimetype = 'image/jpeg';
      const formData = new FormData();
      formData.append('file', JSON.stringify(slip));

      const response = await postData('/api/v2/u/transaction/transaction-slip', formData, 'POST', true);
      if (response.error) {
        return showMessage({ message: response.msg, type: 'danger' });
      }
      showMessage({ message: response.msg, type: 'success' });

    } catch (error) {
      console.log(error, ' error ===========');
      showMessage({ message: 'Network Error', type: 'danger' });
    }
  }

  takeSlipPhoto = (result) => {
    if (result.error) {
      return showMessage({ message: 'Camera Closed', type: 'danger' });
    }
    this.submitSlip(result.data.assets[0]);
  }

  render() {
    const { userProfile } = this.props;
    const { paymentMethod, address } = userProfile;
    if (!userProfile || !paymentMethod) return null;

    const { reg_fees, currency_notation } = address.country;

    return (
      <React.Fragment>
        <TopHeader title="Pay" navigation={this.props.navigation} keyValue="pay" takeSlipPhoto={this.takeSlipPhoto} />
        <Block style={styles.userGuide}>
          <Text style={styles.userGuideFont}>
            You can activate your account in <Text style={styles.bold}>'Earn With Network'</Text> by paying
            <Text style={styles.bold}> Registration fees {currency_notation} {reg_fees}</Text> on given authorized account. You must sumbit pay slip.
          </Text>
        </Block>
        <View>
          {userProfile &&
            <React.Fragment>
              {this.displayPaymentMethod(paymentMethod)}
            </React.Fragment>
          }
        </View>
        <View style={styles.chooseImageBtnContainer}>
          <TouchableOpacity style={styles.chooseImageBtn} onPress={() => openImageGalley(this.takeSlipPhoto)}>
            <Block row>
              <Icon style={styles.chooseImageIcon} name={'image'} size={24} color={AppStyles.color.primary} />
              <Text style={styles.btnText} >Choose Image</Text>
            </Block>
          </TouchableOpacity>
        </View>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  chooseImageBtnContainer: {
    backgroundColor: '#ADD8E6', marginTop: 'auto',
  },
  chooseImageIcon: {
    marginRight: 5,
  },
  btnText: {
    fontSize: 18,
    color: AppStyles.color.primary,
    fontWeight: 'bold',
  },
  chooseImageBtn: {
    width: 'auto',
    borderWidth: 0,
    height: 45,
    alignItems: 'center',
    padding: 10,
  },
  avatarStyle: {
    marginTop: 40,
  },
  iconStyle: {
    paddingTop: 10,
  },
  bold: {
    fontWeight: 'bold',
  },
  userGuide: {
    padding: 10,
  },
  userGuideFont: {
    fontSize: 16,
  },
});

const mapStateToProps = (store) => {
  return { userProfile: store.userInfo };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setUserProfileData: (value) => dispatch(setUserInfo(value)),
    setPageLoader: (value) => dispatch(startPageLoader(value)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PayPage);
