import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const ImageDetails = ({ imageSource,name, address, branch, phone, imageStyle }) => {

  return (
    <View style={styles.container}>
      <Image style={imageStyle} source={imageSource} />
      {address !== undefined ? 
      <View style={{flex:1}}> 
        <Text style={{color:'white', alignSelf:'flex-start', marginLeft: 10, fontSize: 18}}>{branch}</Text>
        <Text style={{color:'white', alignSelf:'flex-start', marginLeft: 10}}>{address}</Text>
        <Text style={{color:'white', alignSelf:'flex-start', marginLeft: 10,marginTop: 5}}>{phone}</Text>
      </View> : 
      <Text style={{textTransform: 'uppercase', margin:10, fontSize: 18, color:'white', paddingLeft:30}}>{name}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
   flexDirection: 'row',
   flex: 1,
  },
  image: {
    flex: 1,
    width: 150,
    height: 150,
    borderWidth: 1
    }
});

export default ImageDetails;
