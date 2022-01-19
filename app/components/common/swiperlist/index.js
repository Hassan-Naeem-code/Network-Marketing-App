/* eslint-disable prettier/prettier */
import React, { Component } from 'react'
import { Text, Dimensions, StyleSheet, View, Image } from 'react-native';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import { getData } from '../fetchData';
import { trimContent } from '../utils';

const { width } = Dimensions.get('screen');

class ProductSwiper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
    };
  }

  getProducts = async () => {
    try {
      const response = await getData('/api/v2/u/products');
      if (response.error) {
        return;
      }
      const { data } = response.data;
      this.setState({ products: data });
    } catch (error) {
      console.log('error');
    }
  }

  componentDidMount = async () => {
    this.getProducts();
  }

  render() {
    const { products } = this.state;
    if (!products || products.length === 0) {
      return null;
    }
    return (
      <React.Fragment>
        <SwiperFlatList autoplay autoplayDelay={2} autoplayLoop index={1} renderAll autoplayLoopKeepAnimation={true}>
          {products.map((item, index) => (
            <View style={styles.container} key={index}>
              <View style={styles.subContainer}>
                <View>
                  <Image source={{ uri: item.image }} style={styles.swiperCardImageStyle} />
                </View>
                <View style={styles.contianerBody}>
                  <Text>{item.item}</Text>
                  <Text style={styles.descriptionText}>
                    {trimContent(item.description, 50)}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </SwiperFlatList>
      </React.Fragment>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1, alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  subContainer: {
    backgroundColor: '#eee', borderRadius: 10, overflow: 'hidden',
  },
  contianerBody: {
    padding: 10, width: 155, backgroundColor: 'white',
  },
  descriptionText: {
    color: '#777', paddingTop: 5,
  },
  swiperCardImageStyle: {
    height: 135,
    width: 155,
  },
  childrenCard: {
    marginTop: 10,
    backgroundColor: 'white',
    height: 300,
    width: 320,
  },
  text: { fontSize: width * 0.5, textAlign: 'center' },
});

export default ProductSwiper;