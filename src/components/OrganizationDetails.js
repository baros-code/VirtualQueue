import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const OrganizationDetails = ({ imageSource,name, address }) => {

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={imageSource} />
      {address !== undefined ? <Text>ADDRESS: {address}</Text> : <Text style={{textTransform: 'uppercase', margin:10, fontSize: 18, color:'white', paddingLeft:30}}>{name}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
   flexDirection: 'column',
  },
  image: {
    flex: 1,
    width: 150,
    height: 150,
    borderWidth: 1,
    }
});

export default OrganizationDetails;
