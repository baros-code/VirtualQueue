import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const ImageDetails = ({ imageSource,name, address, imageStyle }) => {

  return (
    <View style={styles.container}>
      <Image style={imageStyle} source={imageSource} />
      {address !== undefined ? <Text style={{color:'white', alignSelf:'flex-start', margin: 10}}>ADDRESS:{'\n'} {address}</Text> : <Text style={{textTransform: 'uppercase', margin:10, fontSize: 18, color:'white', paddingLeft:30}}>{name}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
   flexDirection: 'row',
   flex: 1
  },
  image: {
    flex: 1,
    width: 150,
    height: 150,
    borderWidth: 1,
    }
});

export default ImageDetails;
