/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */

import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  ImageBackground,
} from 'react-native';
import {Block, Text, theme} from 'galio-framework';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Badge} from 'react-native-paper';
// import { Button } from '../../common/BackButton/argonButton';
import {Images, argonTheme} from '../../common/argon_constants';
import {connect} from 'react-redux';
import {
  setUserInfo,
  startPageLoader,
  updateUserInfo,
} from '../../redux/actions';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {getData} from '../../common/fetchData';
import {showMessage} from 'react-native-flash-message';
import TopHeader from '../../common/header';
import EditProfile from './editProfile';
import ProductSwiper from '../../common/swiperlist';
import {AppStyles} from '../../common/appStyle';
import {shareToSocialMedia} from '../../common/shareToSocial';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width, height} = Dimensions.get('screen');

const thumbMeasure = (width - 48 - 32) / 3;

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
    this.setEditModalRef = this.setEditModalRef.bind(this);
  }

  logoutUserOnTimeout = async statusCode => {
    const allowedStatusCode = [500, 401, 404];

    if (
      this.props.fetchLoader === true &&
      allowedStatusCode.includes(statusCode)
    ) {
      await AsyncStorage.clear();
      this.props.navigation.navigate('Auth');
      this.props.setPageLoader(false);
    }
  };

  componentDidMount = async () => {
    try {
      const {setPageLoader, setUserProfileData} = this.props;
      setPageLoader(true);
      const response = await getData('/api/v2/u/profile');
      if (response.error) {
        this.logoutUserOnTimeout(response.statusCode);
        return showMessage({message: response.msg, type: 'danger'});
      }
      const {data} = response.data;
      setUserProfileData(data);
    } catch (error) {
      console.log('31-profile-index.js =>', error);
    }
  };

  setEditModalRef(ref) {
    this.RBSheet = ref;
  }

  render() {
    const {userProfile, updateUserData} = this.props;
    if (!userProfile) {
      return null;
    }
    const {isActive} = userProfile;
    console.log('this.props', this.props);
    return (
      <React.Fragment>
        <TopHeader
          title="Home"
          navigation={this.props.navigation}
          keyValue="home"
        />

        <Block flex style={styles.profile}>
          <ScrollView>
            <ImageBackground
              source={{
                uri: 'https://ik.imagekit.io/5smh1qf7dxf/assets/userprofilecover_hFQnydyby?updatedAt=1629897988123',
              }}
              style={styles.profileContainer}
              imageStyle={styles.profileBackground}>
              <View style={styles.profileCard}>
                <Block style={styles.avatarContainer}>
                  <Image
                    source={{uri: Images.ProfilePicture}}
                    style={styles.avatar}
                  />
                  <TouchableOpacity
                    style={{position: 'absolute', top: '12%', left: '22%'}}
                    activeOpacity={0.9}
                    onPress={() => this.RBSheet.open()}>
                    <AntDesign name="edit" size={24} color={'white'} />
                  </TouchableOpacity>
                  {isActive ? (
                    <Image
                      source={require('../../../assets/images/verifiedProfile.png')}
                      style={styles.verifiedProfile}
                    />
                  ) : null}
                </Block>
                <Block right style={{marginTop: -15}}>
                  <Text style={styles.ref_code}>{userProfile.ref_code}</Text>
                  {/* <Icon
                    onPress={() => this.RBSheet.open()}
                    name="edit"
                    size={24}
                    color="black"
                  /> */}
                  {userProfile.isActive && (
                    <>
                      <Icon
                        onPress={() => shareToSocialMedia(userProfile.ref_code)}
                        name="share-alt"
                        size={24}
                        color={AppStyles.color.primary}
                      />
                    </>
                  )}
                </Block>
                <View style={[styles.paddingHorizontal2Percent]}>
                  <Text style={styles.userName}>
                    {' '}
                    {`${userProfile.firstName} ${userProfile.lastName}`}{' '}
                  </Text>
                  <Text style={styles.userPhoneNo}> {userProfile.phone} </Text>
                </View>
                <View
                  style={[styles.directionRow, styles.marginVerticle1Percent]}>
                  <View style={[styles.w_20, styles.alignCenter]}></View>
                  <View
                    style={[
                      styles.w_80,
                      styles.directionRow,
                      styles.justifyEvenly,
                    ]}>
                    <View>
                      <Image
                        source={require('../../../assets/images/balance.png')}
                        style={styles.progressIcon}
                        resizeMode={'contain'}
                      />
                      <Text style={styles.amount}>
                        {userProfile.balance || 0}
                      </Text>
                      <Text style={styles.title}>Balance</Text>
                    </View>
                    <View>
                      <Image
                        source={require('../../../assets/images/member.png')}
                        style={styles.progressIcon}
                        resizeMode={'contain'}
                      />
                      <Text style={styles.amount}>
                        {userProfile.children.length}
                      </Text>
                      <Text style={styles.title}>Member</Text>
                    </View>
                    <View>
                      <Image
                        source={require('../../../assets/images/withdraw.png')}
                        style={styles.progressIcon}
                        resizeMode={'contain'}
                      />
                      <Text style={styles.amount}>
                        {userProfile.withdraw || 0}
                      </Text>
                      <Text style={styles.title}>Withdraw</Text>
                    </View>
                  </View>
                </View>
              </View>
              <Block flex style={{paddingHorizontal: 15, marginTop: -90}}>
                <ProductSwiper />
              </Block>
            </ImageBackground>
          </ScrollView>
        </Block>

        <EditProfile
          setEditModalRef={this.setEditModalRef}
          userProfile={userProfile}
          updateUserInfo={updateUserData}
        />
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  profile: {
    flex: 1,
  },
  refCodeBadge: {
    backgroundColor: AppStyles.color.primary2,
    fontSize: 16,
    height: 30,
    color: 'white',
    marginRight: -70,
  },
  isActiveBadge: {
    backgroundColor: argonTheme.COLORS.APPTHEME,
    fontSize: 14,
    borderRadius: 0,
  },
  nonActiveBadge: {
    backgroundColor: argonTheme.COLORS.DANGER,
    fontSize: 14,
    height: 30,
  },
  profileContainer: {
    width: width,
    height: height,
    padding: 0,
    zIndex: 1,
  },
  profileBackground: {
    width: width,
    height: height / 2.1,
  },
  profileCard: {
    padding: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    marginTop: height * 0.11,
    height: height * 0.33,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 8,
    shadowOpacity: 0.2,
    zIndex: 2,
    elevation: 5,
  },
  info: {
    paddingHorizontal: 40,
  },
  avatarContainer: {
    position: 'relative',
    marginTop: -80,
  },
  avatar: {
    width: width * 0.24,
    height: height * 0.14,
    borderRadius: 62,
    borderWidth: 0,
  },
  nameInfo: {
    marginTop: 35,
  },
  divider: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  thumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: 'center',
    width: thumbMeasure,
    height: thumbMeasure,
  },
  verifiedProfile: {
    width: width * 0.1,
    height: height * 0.05,
    position: 'absolute',
    top: '70%',
    left: '18%',
  },
  margin1Percent: {
    marginTop: '1%',
  },
  paddingHorizontal2Percent: {
    paddingHorizontal: '2%',
  },
  marginVerticle1Percent: {
    marginVertical: '1%',
  },
  directionRow: {
    flexDirection: 'row',
  },
  justifyEvenly: {
    justifyContent: 'space-evenly',
  },
  alignCenter: {
    alignItems: 'center',
  },
  w_20: {
    width: '20%',
  },
  w_80: {
    width: '80%',
  },
  progressIcon: {
    width: '100%',
    height: '50%',
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
  },
  ref_code: {
    fontSize: 15,
    fontWeight: '600',
  },
  userPhoneNo: {
    fontSize: 13,
    fontWeight: '500',
  },
  amount: {
    marginVertical: '2%',
    textAlign: 'center',
    fontSize: 13,
  },
  title: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
  },
});

const mapStateToProps = store => {
  return {userProfile: store.userInfo, fetchLoader: store.fetchLoader};
};

const mapDispatchToProps = dispatch => {
  return {
    setUserProfileData: value => dispatch(setUserInfo(value)),
    setPageLoader: value => dispatch(startPageLoader(value)),
    updateUserData: value => dispatch(updateUserInfo(value)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
