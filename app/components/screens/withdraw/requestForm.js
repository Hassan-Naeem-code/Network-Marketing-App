/* eslint-disable react/no-did-mount-set-state */
/* eslint-disable prettier/prettier */

import React, { Component } from 'react';
import TopHeader from '../../common/header';
import { StyleSheet } from 'react-native';
import { TextInput, List, Avatar, Button, Card, Title, HelperText } from 'react-native-paper';
import { showMessage } from 'react-native-flash-message';
import { connect } from 'react-redux';
import { setUserInfo, startPageLoader, updateUserInfo } from '../../redux/actions';
import { AppStyles } from '../../common/appStyle';
import DropDownPicker from 'react-native-dropdown-picker';
import { bankNames } from '../../common/bankname';
import { postData } from '../../common/fetchData';

class RequestForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      withdrawMeta: { accountTitle: null, accountNo: null, paymentMethod: null, amount: 0, gateway: null },
      errorMsg: { accountTitle: null, accountNo: null, paymentMethod: null, amount: 0, gateway: null },
      showPaymentVia: false,
      showBankNameList: false,
    };
  }


  onChangeTextHandler = (key, value) => {
    const { withdrawMeta, errorMsg } = this.state;
    if (errorMsg[key]) {
      errorMsg[key] = null;
      this.setState({ errorMsg });
    }
    withdrawMeta[key] = value;
    this.setState({ withdrawMeta });
  }

  validateEmptyFields = (withdrawMeta, errorMsg, userProfile) => {
    let hasError = false;

    if (withdrawMeta.paymentMethod !== 'bankTransfer') { withdrawMeta.gateway = withdrawMeta.paymentMethod; }
    Object.keys(withdrawMeta).forEach((key) => {
      if (withdrawMeta[key] === '' || !withdrawMeta[key]) {
        hasError = true;
        withdrawMeta[key] = '';
        errorMsg[key] = 'Field is Required';
        return;
      }
      errorMsg[key] = null;
    });
    if (!hasError) {
      if (withdrawMeta.amount > userProfile.balance) {
        errorMsg.amount = 'You dont have enough amount to withdraw';
        hasError = true;
      }
    }
    return hasError;
  }

  resetWithDrawMeta = () => {
    const withdrawMeta = { accountTitle: null, accountNo: null, paymentMethod: null, amount: 0, gateway: null };
    this.setState({ withdrawMeta });
  };

  onSubmitWithdrawRequest = async () => {
    try {
      const { userProfile, setPageLoader, updateUserData } = this.props;
      const { withdrawMeta, errorMsg } = this.state;
      const hasError = this.validateEmptyFields(withdrawMeta, errorMsg, userProfile);
      if (hasError) {
        return this.setState({ withdrawMeta });
      }
      setPageLoader(true);
      withdrawMeta.type = 'withdraw';
      const response = await postData('/api/v2/u/transaction', withdrawMeta);
      if (response.error) {
        this.resetWithDrawMeta();
        updateUserData(userProfile);
        return showMessage({ message: response.msg, type: 'danger' });
      }
      const { data } = response.data;
      // update withdraw
      userProfile.withdraw = (userProfile.withdraw || 0) + data.amount;
      // update balance
      const currentBalance = userProfile.balance;
      const remainingAmount = currentBalance - withdrawMeta.amount;
      userProfile.balance = remainingAmount;
      // update transaction
      let pendingTransaction = userProfile.pendingTransaction;
      if (!pendingTransaction) {
        pendingTransaction = [];
      }
      pendingTransaction.push(data);
      userProfile.pendingTransaction = pendingTransaction;
      this.resetWithDrawMeta();
      updateUserData(userProfile);
      showMessage({ message: response.msg, type: 'success' });

    } catch (error) {
      this.props.setPageLoader(false);
      console.log(error);
    }
  }

  showErrorHelperText = (key) => {
    const { withdrawMeta, errorMsg } = this.state;
    const value = withdrawMeta[key];
    if (value !== '' && !errorMsg[key]) return;
    return (
      <HelperText type="error" visible={true}>{errorMsg[key] || 'Field is Required!'}</HelperText>
    );
  }

  setBankNameOpen = () => this.setState({ showBankNameList: !this.state.showBankNameList })
  setOpen = () => this.setState({ showPaymentVia: !this.state.showPaymentVia })
  LeftContent = props => <Avatar.Icon {...props} icon="cash" style={styles.avatarCashIcon} />

  render() {
    const paymentViaList = [
      { value: 'jazzcash', label: 'Jazz Cash' },
      { value: 'easypaisa', label: 'Easy Paisa' },
      { value: 'bankTransfer', label: 'Bank Transfer' },
    ];

    const { withdrawMeta, showPaymentVia, showBankNameList } = this.state;
    const { userProfile } = this.props;
    const textInputTheme = { primary: AppStyles.color.primary, background: 'transparent' };
    if (!userProfile) {
      return null;
    }

    return (
      <React.Fragment>
        <Card.Content>
          <DropDownPicker
            placeholder="select payment via"
            open={showPaymentVia}
            setOpen={this.setOpen}
            value={withdrawMeta.paymentMethod}
            setValue={(callback) => this.onChangeTextHandler('paymentMethod', callback())}
            items={paymentViaList}
            style={styles.dropdownStyle}
          />
          {this.showErrorHelperText('paymentMethod')}

          {withdrawMeta.paymentMethod === 'bankTransfer' &&
            <React.Fragment>
              <DropDownPicker
                placeholder="Bank Name"
                open={showBankNameList}
                searchable={true}
                setOpen={this.setBankNameOpen}
                value={withdrawMeta.gateway}
                setValue={(callback) => this.onChangeTextHandler('gateway', callback())}
                items={bankNames}
                style={styles.dropdownStyle}
              />
              {this.showErrorHelperText('gateway')}
            </React.Fragment>
          }

          <TextInput
            label="Account Title"
            theme={{ colors: textInputTheme }}
            mode="flat"
            value={withdrawMeta.accountTitle}
            onChangeText={(value) => this.onChangeTextHandler('accountTitle', value)}
          />
          {this.showErrorHelperText('accountTitle')}

          <TextInput
            label="Account No"
            theme={{ colors: textInputTheme }}
            mode="flat"
            value={withdrawMeta.accountNo}
            onChangeText={(value) => this.onChangeTextHandler('accountNo', value)}
          />
          {this.showErrorHelperText('accountNo')}

          <TextInput
            label="Amount"
            theme={{ colors: textInputTheme }}
            mode="flat"
            value={withdrawMeta.amount}
            keyboardType="number-pad"
            onChangeText={(value) => this.onChangeTextHandler('amount', value)}
          />
          {this.showErrorHelperText('amount')}

        </Card.Content>
        <Card.Actions>
          <Button color={AppStyles.color.primary} onPress={this.resetWithDrawMeta}>Reset</Button>
          <Button color={AppStyles.color.primary} onPress={this.onSubmitWithdrawRequest}>Ok</Button>
        </Card.Actions>

      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  avatarCashIcon: {
    backgroundColor: AppStyles.color.primary,
  },
  dropdownStyle: {
    borderColor: 'white',
    borderBottomColor: 'black',
    borderRadius: 0,
  },
  cardTitleStyle: {
    fontSize: 15,
  },
});

const mapStateToProps = (store) => {
  return { userProfile: store.userInfo };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setUserProfileData: (value) => dispatch(setUserInfo(value)),
    setPageLoader: (value) => dispatch(startPageLoader(value)),
    updateUserData: (value) => dispatch(updateUserInfo(value)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RequestForm)