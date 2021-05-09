import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Button, TouchableOpacity } from 'react-native';
//import { Context as ImageContext } .....
import { Feather, AntDesign } from '@expo/vector-icons'; 
import { firebase } from '../firebase/config'
import { getClientData } from './ClientDetails'


const ListClients = ( {navigation} ) => {

  // [] reservations
  const [state, setState] = useState([]);

  const USER_ID = navigation.getParam("uid");
  const QUEUE_ID = navigation.getParam('queueId');
    

  /*async yazınca 1 tane geliyor, yazmayınca 5 tane geliyor */


  useEffect(()  => {
    const fetchReservationsAndClient = async  () => {
      try {
          //setState(state);
          const ref = await firebase.database().ref("reservations");
          let response = [];
      
          await ref.once("value", function (reservationsSnapShot) {  
            reservationsSnapShot.forEach( reservationSnapShot =>  {
                let currentReservation = reservationSnapShot.val();
                currentReservation.id = reservationSnapShot.key;
                if (currentReservation.queueId === QUEUE_ID) {
                  //currentReservation.client = await getClientData(currentReservation.clientId);
                  //console.log("THIS IS CLIENT DATA RETURNED: " + getClientData(currentReservation.clientId));
                  response.push(currentReservation);
                }
            });      
            setState(response);
        });   
        setState(response);

      } catch (e) {
          console.log(e);
          setState(state);
      }
  };
    fetchReservationsAndClient();
  }, [state]);



  return (
  <View style={styles.background}>
    <FlatList
      data={state}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({item}) => {
        return (
        <TouchableOpacity onPress={() => navigation.navigate("ClientDetails", {uid: USER_ID, reservationId: item.id, clientId: item.client.id})}>
          <View style={styles.row}>     
            <Text style={styles.title}>{item.client} - {item.id}</Text>
          </View>
        </TouchableOpacity>
        );
      }}
    />
  </View>
  );
};


const styles = StyleSheet.create({
  background: {
    backgroundColor: '#047DB9',
    color:"white"
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderColor: 'gray',
    color:"white"
  },
  title: {
    fontSize: 18,
    color:"white"
  },
  icon: {
    fontSize: 24,
    color:"white",
    margin: 10
  },
  link: {
    color:"red",
    margin:10,
  }
});


export default ListClients;

