import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Image} from 'react-native';
import { images } from '../images'
import { firebase } from '../firebase/config'
import ImageDetails from '../components/ImageDetails';

const Services = ( {navigation} ) => {

    const [state, setState] = useState([]);

    const clientId = navigation.getParam('clientId');

    useEffect(()  => {
        const fetchServices = async  () => {
          try {
              setState(state);
              const ref = await firebase.database().ref("services");
              var response = [];
              await ref.once("value",function (servicesSnapShot) {
                servicesSnapShot.forEach( serviceSnapShot => {
                    let currentService = serviceSnapShot.val()
                    currentService.name = serviceSnapShot.key;
                    currentService.logo = images.find(image => image.name === currentService.name).image;
                    response.push(currentService) 
                });
                setState(response);
            });   
              
          } catch (e) {
              console.log(e);
              setState(state);
          }
      };
        fetchServices();
      }, [state]);


    return (
    <View>
        <FlatList
            data={state}
            keyExtractor={(service) => service.name.toString()}
            renderItem={({item}) => {
            return (
                    <TouchableOpacity onPress={() => navigation.navigate("Organizations", {serviceType: item.name, clientId: clientId})}>
                        <View style={styles.row}>
                            <ImageDetails
                            imageSource={item.logo}
                            name={item.name}
                            imageStyle={styles.logo}
                            />
                            </View>
                    </TouchableOpacity>
                
            );
            }}
        />
    </View>
    );
};

const styles = StyleSheet.create({
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 70,
      paddingHorizontal: 10,
      borderTopWidth: 1,
      borderColor: 'white',
    },
    logo: {
        width: 150,
        height: 150,
        borderWidth: 1,
        }
  });

export default Services;
