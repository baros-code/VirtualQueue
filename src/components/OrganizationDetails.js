import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const OrganizationDetails = ({ imageSource, name, address }) => {

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={imageSource} />
      <Text>ADDRESS: {address}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
   flexDirection: 'column',
  },
  image: {
    flex: 1,
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: 'black'
    }
});

export default OrganizationDetails;
