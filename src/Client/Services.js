import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Image} from 'react-native';
import { images } from '../images'
import { firebase } from '../firebase/config'
import OrganizationDetails from '../components/OrganizationDetails';

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
                    currentService.imageSource = images.find(image => image.name === currentService.name).image;
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
                <TouchableOpacity onPress={() => navigation.navigate("Organizations", {service: item.name, clientId: clientId})}>
                    <View style={styles.row}>
                        <OrganizationDetails
                        imageSource={item.imageSource}
                        name={item.name}
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
  });

export default Services;
