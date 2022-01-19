/* eslint-disable prettier/prettier */
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import AnimatedLoader from "react-native-animated-loader";
import { connect } from 'react-redux';
import { startPageLoader } from '../redux/actions';

class Loader extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { pageLoadVisible } = this.props;
    return (
      <AnimatedLoader
        visible={pageLoadVisible}
        overlayColor="rgba(255,255,255,0.75)"
        // source={require("./loader.json")}
        animationStyle={styles.lottie}
        speed={1}
      >
        <Text>Fetcing...</Text>
      </AnimatedLoader>
    );
  }
}

const styles = StyleSheet.create({
  lottie: {
    width: 100,
    height: 100
  }
});

const mapStateToProps = (store) => {
  return { pageLoadVisible: store.fetchLoader };
};

const mapDispatchToProps = (dispatch) => {
  return {
    pageLoaderStart: (value) => dispatch(startPageLoader(value)),
  };
};

export default connect(mapStateToProps, null)(Loader);

