import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Image} from 'react-native';
import ImageDetails from '../components/ImageDetails';
import { firebase } from '../firebase/config'
import { images } from '../images'


const Organizations = ( {navigation} ) => {

    const [state, setState] = useState([]);

    const serviceType = navigation.getParam('serviceType');
    const clientId = navigation.getParam('clientId');

    //console.log("this is service type: " + serviceType);

    useEffect(()  => {
        const serviceType = navigation.getParam('serviceType');
        const fetchServices = async  () => {
          try {
              setState(state);
              const ref = await firebase.database().ref("services/"+serviceType);
              var response = [];
              await ref.once("value",function (organizationsSnapShot) {
                organizationsSnapShot.forEach( organizationSnapShot => {
                    let currentOrganization = organizationSnapShot.val()
                    currentOrganization.id = organizationSnapShot.key;
                    currentOrganization.logo = images.find(image => image.name === currentOrganization.name).image;
                    response.push(currentOrganization) 
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
            keyExtractor={(organization) => organization.id.toString()}
            renderItem={({item}) => {
            return (
                <TouchableOpacity onPress={() => navigation.navigate("CreateReservation", {serviceType: serviceType, organizationId: item.id, organizationName: item.name, clientId: clientId})}>
                    <View style={styles.row}>
                        <ImageDetails
                        imageSource={item.logo}
                        name={item.name}
                        address={item.address}
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
      paddingVertical: 20,
      paddingHorizontal: 10,
      borderTopWidth: 1,
      borderColor: 'white',
    },
    logo: {
        width: 100,
        height: 100,
        borderWidth: 1,
        }
  });

export default Organizations;
