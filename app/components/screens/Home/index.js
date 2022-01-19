/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */

import React from 'react';
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  ImageBackground,
} from 'react-native';
import { Block, Text, theme } from 'galio-framework';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Badge } from 'react-native-paper';
// import { Button } from '../../common/BackButton/argonButton';
import { Images, argonTheme } from '../../common/argon_constants';
import { connect } from 'react-redux';
import { setUserInfo, startPageLoader, updateUserInfo } from '../../redux/actions';
import { getData } from '../../common/fetchData';
import { showMessage } from 'react-native-flash-message';
import TopHeader from '../../common/header';
import EditProfile from './editProfile';
import ProductSwiper from '../../common/swiperlist';
import { AppStyles } from '../../common/appStyle';
import { shareToSocialMedia } from '../../common/shareToSocial';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('screen');

const thumbMeasure = (width - 48 - 32) / 3;

class HomePage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
    this.setEditModalRef = this.setEditModalRef.bind(this);
  }

  logoutUserOnTimeout = async (statusCode) => {
    const allowedStatusCode = [500, 401, 404];

    if (this.props.fetchLoader === true && allowedStatusCode.includes(statusCode)) {
      await AsyncStorage.clear();
      this.props.navigation.navigate('Auth');
      this.props.setPageLoader(false);
    }
  }

  componentDidMount = async () => {
    try {
      const { setPageLoader, setUserProfileData } = this.props;
      setPageLoader(true);
      const response = await getData('/api/v2/u/profile');
      if (response.error) {
        this.logoutUserOnTimeout(response.statusCode);
        return showMessage({ message: response.msg, type: 'danger' });
      }
      const { data } = response.data;
      setUserProfileData(data);
    } catch (error) {
      console.log('31-profile-index.js =>', error);
    }
  }

  setEditModalRef(ref) {
    this.RBSheet = ref;
  }

  render() {
    const { userProfile, updateUserData } = this.props;
    if (!userProfile) { return null; }
    const { isActive } = userProfile;

    return (
      <React.Fragment>
        <TopHeader title="Home" navigation={this.props.navigation} keyValue="home" />

        <Block flex style={styles.profile}>
          <ScrollView>
            <Block flex style={{ marginTop: -30 }}>
              <ImageBackground
                source={{ uri: 'https://ik.imagekit.io/5smh1qf7dxf/assets/userprofilecover_hFQnydyby?updatedAt=1629897988123' }}
                style={styles.profileContainer}
                imageStyle={styles.profileBackground}
              >
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={{ width, marginTop: '25%' }}
                >
                  <Block flex style={styles.profileCard}>
                    <Block middle style={styles.avatarContainer}>
                      <Image
                        source={{ uri: Images.ProfilePicture }}
                        style={styles.avatar}
                      />
                    </Block>
                    <Block right style={{ marginTop: -30 }}><Icon onPress={() => this.RBSheet.open()} name="edit" size={24} color="black" /></Block>
                    <Block style={styles.info}>

                      <Block middle row space="evenly" style={{ marginTop: 20, paddingBottom: 24 }}>
                        <Badge style={isActive ? styles.isActiveBadge : styles.nonActiveBadge}>{isActive ? 'Active' : 'Your Account is not Active'}</Badge>
                      </Block>

                      <Block row space="between">
                        <Block middle>
                          <Text bold size={18} color="#525F7F" style={{ marginBottom: 4 }}>{userProfile.balance || 0}</Text>
                          <Text size={12} color={argonTheme.COLORS.TEXT}>Balance</Text>
                        </Block>

                        <Block middle>
                          <Text bold color="#525F7F" size={18} style={{ marginBottom: 4 }}>{userProfile.children.length}</Text>
                          <Text size={12} color={argonTheme.COLORS.TEXT}>Member</Text>
                        </Block>

                        <Block middle>
                          <Text bold color="#525F7F" size={18} style={{ marginBottom: 4 }}>{userProfile.withdraw || 0}</Text>
                          <Text size={12} color={argonTheme.COLORS.TEXT}>Withdraw</Text>
                        </Block>
                      </Block>
                    </Block>

                    <Block flex>
                      <Block middle style={styles.nameInfo}>
                        <Text bold size={28} color="#32325D">
                          {`${userProfile.firstName} ${userProfile.lastName}`}
                        </Text>
                        <Text size={16} color="#32325D" style={{ marginTop: 10 }}>
                          {userProfile.phone}
                        </Text>
                      </Block>
                      {userProfile.isActive &&
                        <Block middle row space="evenly" style={{ marginTop: 20, paddingBottom: 24 }} >
                          <Badge style={styles.refCodeBadge}>{userProfile.ref_code}</Badge>
                          <Icon onPress={() => shareToSocialMedia(userProfile.ref_code)} name="share-alt" size={24} color={AppStyles.color.primary} />
                        </Block>
                      }
                      <Block middle style={{ marginTop: 30, marginBottom: 16 }}>
                        <Block style={styles.divider} />
                      </Block>
                    </Block>
                  </Block>
                </ScrollView>
              </ImageBackground>
            </Block>
            <Block flex style={{ marginTop: -210, padding: 15 }}>
              <ProductSwiper />
            </Block>
          </ScrollView>
        </Block>

        <EditProfile setEditModalRef={this.setEditModalRef} userProfile={userProfile} updateUserInfo={updateUserData} />
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  profile: {
    // marginTop: Platform.OS === 'android' ? -HeaderHeight : 0,
    flex: 1,
  },
  refCodeBadge: {
    backgroundColor: AppStyles.color.primary2,
    fontSize: 16, height: 30,
    color: 'white',
    marginRight: -70,
  },
  isActiveBadge: {
    backgroundColor: argonTheme.COLORS.APPTHEME, fontSize: 14, borderRadius: 0,
  },
  nonActiveBadge: {
    backgroundColor: argonTheme.COLORS.DANGER, fontSize: 14, height: 30,
  },
  profileContainer: {
    width: width,
    height: height,
    padding: 0,
    zIndex: 1,
  },
  profileBackground: {
    width: width,
    height: height / 2,
  },
  profileCard: {
    // position: "relative",
    padding: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    marginTop: 65,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    zIndex: 2,
  },
  info: {
    paddingHorizontal: 40,
  },
  avatarContainer: {
    position: 'relative',
    marginTop: -80,
  },
  avatar: {
    width: 124,
    height: 124,
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
});

const mapStateToProps = (store) => {
  return { userProfile: store.userInfo, fetchLoader: store.fetchLoader };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setUserProfileData: (value) => dispatch(setUserInfo(value)),
    setPageLoader: (value) => dispatch(startPageLoader(value)),
    updateUserData: (value) => dispatch(updateUserInfo(value)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
