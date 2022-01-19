/* eslint-disable prettier/prettier */
/* eslint-disable react/no-did-mount-set-state */

import React, { Component } from 'react';
import TopHeader from '../../common/header';
import { StyleSheet, ScrollView } from 'react-native';
import { List, Avatar, Card, HelperText } from 'react-native-paper';
import { getData, postData } from '../../common/fetchData';
import { showMessage } from 'react-native-flash-message';
import { Button } from 'galio-framework';
import { connect } from 'react-redux';
import { setUserInfo, startPageLoader, updateUserInfo } from '../../redux/actions';
import { AppStyles } from '../../common/appStyle';
import RequestForm from './requestForm';
import Icon from 'react-native-vector-icons/FontAwesome';

const AccodianTheme = { colors: { primary: AppStyles.color.primary2 } }

class WithDraw extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transactions: [],
      withdrawMeta: { accountTitle: null, accountNo: null, paymentMethod: null, amount: 0, gateway: null },
      errorMsg: { accountTitle: null, accountNo: null, paymentMethod: null, amount: 0, gateway: null },
      showPaymentVia: false,
      showBankNameList: false,
      expandedPending: false,
      expandedCompleted: false,
      expandedCancelled: false,
    };
  }

  deletePendingTransaction = async (index, tid, amount) => {
    try {
      const url = `/api/v2/u/transaction?tid=${tid}`;
      const response = await getData(url, 'DELETE');
      if (response.error) {
        return showMessage({ message: response.msg, type: 'danger' });
      }
      const { userProfile, updateUserData } = this.props;
      userProfile.pendingTransaction.splice(index, 1);
      userProfile.balance += amount;
      userProfile.withdraw -= amount;
      updateUserData(userProfile);
      showMessage({ message: response.msg, type: 'success' });
    } catch (error) {
      showMessage({ message: 'Network Error', type: 'danger' });
    }
  }

  getUserTransaction = async () => {
    try {
      const { userProfile, updateUserData } = this.props;
      const response = await getData('/api/v2/u/transaction');
      if (response.error) {
        return showMessage({ message: response.msg, type: 'danger' });
      }
      const { data } = response.data;
      this.setState({ transactions: data });
      const pendingTransaction = [];
      const completedTransaction = [];
      const cancelledTransaction = [];


      data.forEach((item) => {
        if (item.status === 'completed') completedTransaction.push(item);
        if (item.status === 'pending') pendingTransaction.push(item);
        if (item.status === 'cancelled') cancelledTransaction.push(item);
      });
      // update on redux
      userProfile.pendingTransaction = pendingTransaction;
      userProfile.completedTransaction = completedTransaction;
      userProfile.cancelledTransaction = cancelledTransaction;

      updateUserData(userProfile);

    } catch (error) {
      console.error(error);
    }
  }

  componentDidMount = async () => {
    this.getUserTransaction();
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
      const currentBalance = userProfile.balance;
      const remainingAmount = currentBalance - withdrawMeta.amount;
      userProfile.balance = remainingAmount;
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

  setExpanded = (status) => {
    if (status === 'pending') {
      this.setState({ expandedPending: !this.state.expandedPending });
    }
    if (status === 'completed') {
      this.setState({ expandedCompleted: !this.state.expandedCompleted });
    }
    if (status === 'cancelled') {
      this.setState({ expandedCancelled: !this.state.expandedCancelled });
    }
  }
  setBankNameOpen = () => this.setState({ showBankNameList: !this.state.showBankNameList })
  setOpen = () => this.setState({ showPaymentVia: !this.state.showPaymentVia })
  LeftContent = props => <Avatar.Icon {...props} icon="cash" style={styles.avatarCashIcon} color="white" />
  render() {
    const { expandedCompleted, expandedPending, expandedCancelled } = this.state;
    const { userProfile } = this.props;
    if (!userProfile) {
      return null;
    }

    const { pendingTransaction, completedTransaction, cancelledTransaction } = userProfile;
    const currentNotation = userProfile.address.country && userProfile.address.country.currency_notation || 'PKR';

    return (
      <React.Fragment>
        <TopHeader title="Withdraw" navigation={this.props.navigation} />
        <ScrollView>
          <Card>
            <Card.Title title="Current Balance" subtitle={`Rs.${userProfile.balance}`} left={this.LeftContent} />
            <List.Section>
              <List.Accordion title="Request Withdraw" theme={AccodianTheme}>
                <RequestForm />
              </List.Accordion>
            </List.Section>

            {pendingTransaction && pendingTransaction.length > 0 &&
              <List.Accordion
                theme={AccodianTheme}
                title={`Pending Request (${pendingTransaction.length})`}
                expanded={expandedPending}
                onPress={() => this.setExpanded('pending')}>

                {pendingTransaction.map((item, index) => (
                  <List.Item key={index} title={`Amount: ${item.amount} ${currentNotation}`}
                    description={`Account No: ${item.accountNo}`}
                    right={() => <Button onPress={() => this.deletePendingTransaction(index, item._id, item.amount)}
                      style={styles.deleteBtn}>Delete</Button>} />
                ))}
              </List.Accordion>
            }

            {completedTransaction && completedTransaction.length > 0 &&
              <List.Accordion
                theme={AccodianTheme}
                title={`Completed Request (${completedTransaction.length})`}
                expanded={expandedCompleted}
                onPress={() => this.setExpanded('completed')}>
                {completedTransaction.map((item, index) => (
                  <List.Item key={index} title={`Amount: ${item.amount} ${currentNotation}`}
                    description={`Account No: ${item.accountNo}`}
                    right={() => <Icon name="check" size={24} color={AppStyles.color.tint} />}
                  />
                ))}
              </List.Accordion>
            }

            {cancelledTransaction && cancelledTransaction.length > 0 &&
              <List.Accordion
                theme={AccodianTheme}
                title={`Cancelled Request (${cancelledTransaction.length})`}
                expanded={expandedCancelled}
                onPress={() => this.setExpanded('cancelled')}>

                {cancelledTransaction.map((item, index) => (
                  <List.Item key={index} title={`Amount: ${item.amount} ${currentNotation}`}
                    description={`Account No: ${item.accountNo}`}
                    right={() => <Icon name="close" size={24} color={AppStyles.color.red} />} />
                ))}
              </List.Accordion>
            }
          </Card>
        </ScrollView>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  deleteBtn: {
    width: '20%',
    backgroundColor: AppStyles.color.primary2,
  },
  avatarCashIcon: {
    backgroundColor: AppStyles.color.primary2,
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

export default connect(mapStateToProps, mapDispatchToProps)(WithDraw)