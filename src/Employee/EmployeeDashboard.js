import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Button, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons'; 





const EmployeeDashboard = ( {navigation} ) => {

  const USER_ID = navigation.getParam("uid");
  const QUEUE_ID = navigation.getParam("queueId");


  // state = reservations[]

  const [ state, setState ] = useState([]);


  const getFirstReservation = () => {
    state.sort(function (r1, r2) {return r1.date})
  }

  //orderby(date), getfirst one.
  useEffect(() => {
    const fetchReservations= async () => { 
      const reservationsReference=await firebase.database().ref("reservations")
      let response=[]; 
      await reservationsReference.once("value",function (reservations) {
          reservations.forEach( reservation => {
              let currentReservation=reservation.val()
              currentReservation.id=reservation.key
              if (currentReservation.queueId === QUEUE_ID) {            //If the reservation is in the employee's queue
                response.push(currentReservation);                
              }
          });
          setState(response)
      })
     
  }
  fetchReservations()
  },([state]));


    
  return (
  <View style={styles.background}>
    <FlatList
      data={state}
      keyExtractor={(queue) => queue.transactionType}
      renderItem={({item}) => {
        return (
        <TouchableOpacity onPress={() => navigation.navigate("QueueDetails", {id: item.id})}>
          <View style={styles.row}>     
            <View style={styles.content}>
                <Text style={styles.title}>{item.transactionType} -  {item.clients[0] == null ? `Current client: none` : `Current client: ${item.clients[0].reservationId}` }  </Text> 
            </View>
            
          </View>
        </TouchableOpacity>
        );
      }}
    />
  </View>
  );
};

EmployeeDashboard.navigationOptions = ( {navigation} ) => {
  return {
    headerRight: () => (
      <TouchableOpacity onPress={() => navigation.navigate('CreateQueue')}>
        <Feather style={styles.icon} name="plus" size={30} />
      </TouchableOpacity>
    ),
  };
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
  content: {
      
  },
  title: {
    fontSize: 18,
    color:"white"
  },
  icon: {
    fontSize: 24,
    color:"white"
  },
  link: {
    color: 'red',
    margin: 10
  },
});


export default EmployeeDashboard;
