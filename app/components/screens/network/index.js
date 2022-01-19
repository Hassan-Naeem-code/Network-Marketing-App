/* eslint-disable prettier/prettier */
import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { AppStyles } from '../../common/appStyle';
import { connect } from 'react-redux';
import { setUserInfo, startPageLoader } from '../../redux/actions';
import { Card } from 'galio-framework';
import Icon from 'react-native-vector-icons/FontAwesome';
import TopHeader from '../../common/header';

const { width } = Dimensions.get('screen');

class Network extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  displayChildNetworkList = (children) => {
    if (children.length > 0) {
      return children.map((item, index) => (
        <View style={styles.cardContainer} key={index}>
          <Card
            key={index}
            style={styles.childrenCard}
            title={`${item.firstName} ${item.lastName}`}
            caption="Your Invitee"
            location={'Pakistan'}
            avatar="https://www.clipartmax.com/png/middle/83-836357_greg-ezeilo-avatar-icon-png.png"
          />
        </View>
      ));
    }
  }

  displayParentNetwork = (parent) => {
    return (
      <View style={styles.cardContainer}>
        <Card
          style={styles.card}
          title={parent ? `${parent.firstName} ${parent.lastName}` : 'You Are ROOT User'}
          caption="Your Referer"
          location={parent ? 'Pakistan' : 'N/A'}
          avatar="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRblGHmIA70kc9T4UJy-AFc0YLcnPpu5kwR2Q&usqp=CAU"
        />
      </View>

    );
  }

  render() {
    const { userProfile } = this.props;

    return (
      <React.Fragment>
        <TopHeader title="Network" navigation={this.props.navigation} />
        <View>
          {userProfile &&
            <React.Fragment>
              {this.displayParentNetwork(userProfile.parent)}
              <View style={styles.container}>
                <Text style={styles.sloganStyle}>Refer to 5 users and get a chance to earn more</Text>
              </View>
              {this.displayChildNetworkList(userProfile.children)}
            </React.Fragment>
          }
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
    marginTop: 10,
    padding: 20,
  },
  child: { justifyContent: 'center', width: width },
  iconStyle: {
    paddingTop: 10,
  },
  sloganStyle: {
    fontWeight: 'bold',
  },
  childrenCard: {
    marginTop: 10,
    backgroundColor: 'white',
    height: 100,
    width: 320,
    borderColor: AppStyles.color.primary,
  },
  card: {
    marginTop: 10,
    backgroundColor: 'white',
    height: 100,
    width: 320,
    borderColor: AppStyles.color.primary2,
  },
  cardContainer: {
    justifyContent: 'center',
    alignItems: 'center',
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

export default connect(mapStateToProps, mapDispatchToProps)(Network);
