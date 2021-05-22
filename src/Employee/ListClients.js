import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Button, TouchableOpacity } from 'react-native';
//import { Context as ImageContext } .....
import { Feather, AntDesign } from '@expo/vector-icons'; 
import { firebase } from '../firebase/config'
import { AuthContext } from '../Authentication/AuthContext'; 


const ListClients = ( {navigation, route} ) => {

  // [] reservations
  const [state, setState] = useState([]);

  const QUEUE_ID = route.params.queueId;


  /*async yazınca 1 tane geliyor, yazmayınca 5 tane geliyor */

  const addClientData = async (reservations) => {
    const ref = await firebase.database().ref("users");
    const result = [];
    await ref.once("value", function (users) {
      users.forEach( user => {
        let currentUser = user.val();
        currentUser.id = user.key;
        reservations.forEach( reservation => {
          if (reservation.clientId === currentUser.id)
              result.push({...reservation, client: currentUser})
        });
      });
    });
    return result;    
  };

  useEffect(()  => {
    const fetchReservations = async  () => {
      try {
          const ref = await firebase.database().ref("reservations");
          let response = [];
      
          await ref.once("value", function (reservationsSnapShot) {  
            reservationsSnapShot.forEach( reservationSnapShot =>  {
                let currentReservation = reservationSnapShot.val();
                currentReservation.id = reservationSnapShot.key;
                if (currentReservation.queueId === QUEUE_ID && (currentReservation.status.toString() === "0" || currentReservation.status.toString() === "1") ) {
                  response.push(currentReservation);
                }
            });      
        });
        addClientData(response).then(result => {
          setState(result);
        });
        
      } catch (e) {
          console.log(e);
          setState(state);
      }
  };
    fetchReservations();
  }, [state]);



  if(state && state.length > 0) {
    return (
      <View style={styles.background}>
        <FlatList
          data={state}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({item}) => {
            return (
            <TouchableOpacity onPress={() => navigation.push("ClientDetails", {reservation: item})}>
              <View style={styles.row}>     
                <Text style={styles.title}>{item.client.fullName} - {item.id}</Text>
              </View>
            </TouchableOpacity>
            );
          }}
        />
      </View>
      );
  }
  else {
    return (
      <View>
        <Text>QUEUE IS EMPTY!</Text>
      </View>
    )
  }
  
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

