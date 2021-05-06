import React, { useEffect, useState } from 'react';

import { View, Text, StyleSheet, FlatList, TouchableOpacity, Button } from 'react-native';
import { Feather } from '@expo/vector-icons'; 
import { firebase } from '../firebase/config'




const ClientDashboard = ( {navigation} ) => {

  const USER_ID = navigation.getParam("uid");

 // const [state, setState] = useState({reservations: [], dataIsReturned: false});

  const [state, setState] = useState([]);


  const deleteReservation = (id) => {
    const ref = firebase.database().ref("reservations");   
    ref.child(id).remove();         //if not found exception eklenmeli.
  
    setState(state.filter(reservation => {return reservation.id !== id} ) );
    
  
  }
    
  useEffect(()  => {
    const fetchReservations = async  () => {
      try {
          setState(state);
          //const response = await axios.get(USER_SERVICE_URL);
          const ref = await firebase.database().ref("reservations");
          var response = [];
          await ref.once("value",function (reservationsSnapShot) {
            reservationsSnapShot.forEach( reservationSnapShot => {
                let currentReservation = reservationSnapShot.val()
                currentReservation.id = reservationSnapShot.key;
                let clientId = currentReservation.clientId;
                if (clientId === USER_ID) {
                  response.push(currentReservation)
                    
                }
            });
            setState(response);
        });   
          
      } catch (e) {
          console.log(e);
          setState(state);
      }
  };
    fetchReservations();
  }, [state]);

 
 
  if (state) {
    return (
      <View style={styles.background}>
        {state.length !== 0 ? <FlatList
          data={state}
          keyExtractor={(reservation) => reservation.id.toString()}
          renderItem={({item}) => {
            return (
            <TouchableOpacity onPress={() => navigation.navigate("Details", {id: item.id})}>
              <View style={styles.row}>     
                <Text style={styles.organizationStyle}>{item.organizationId} - {`${item.date}`}</Text>
                <TouchableOpacity onPress={() => deleteReservation(item.id)}>
                  <Feather style={styles.icon} name="trash" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
            ); 
          }}
        /> : <Text style={styles.text}>No reservations found!</Text>}
      </View>
      );
  }

  else {
    return <View>
      <Text>LOADING SCREEN...</Text>
    </View>
  }

};

/*Whenever React renders ClientDashboard, react-navigation automatically
calls the navigationOptions function.
 */

ClientDashboard.navigationOptions = ( {navigation} ) => {
  return {
    headerRight: () => (
      <TouchableOpacity onPress={() => navigation.navigate('Organizations', {clientId: navigation.getParam("uid"), clientName: navigation.getParam("fullName")} )}>
        <Feather  name="plus" color="#0e66d4" size={30} />
      </TouchableOpacity>
    ),
    title: "Hello, " + navigation.getParam("fullName"),
  };
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#0e66d4'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderColor: 'gray'
  },
  organizationStyle: {
    fontSize: 18,
    color: 'white'
  },
  icon: {
    fontSize: 24
  },
  button: {
    marginVertical: 20,
  },
  text: {
    fontSize: 24,
  }
});


export default ClientDashboard;

