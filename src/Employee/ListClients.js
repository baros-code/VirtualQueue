import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Button, TouchableOpacity } from 'react-native';
//import { Context as ImageContext } .....
import { FontAwesome, AntDesign,Feather } from '@expo/vector-icons'; 
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
                <FontAwesome style={styles.icon} name="user-circle-o" size={52} color="#0e66d4" />     
                <Text style={styles.title}>{item.client.fullName}</Text>
                <View style={styles.mainInformation}>
                <Feather style= {{  paddingVertical:10,paddingHorizontal:5}}name="clock" size={28} color="#0e66d4" />
                <Text style={styles.title2}>{item.estimatedTime}</Text>
                </View>
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
  row: {
    flex:1,
    flexDirection: 'row',
    justifyContent:"center",
    padding:5,
    backgroundColor:"white",
    marginTop:30,
    borderRadius:15,
    borderColor: 'gray',
  },
  title: {
    flex:1,
    paddingVertical:10,
    paddingHorizontal:20,
    marginLeft:5,
    textTransform:"uppercase",
    fontSize: 23,
    color:"#0e66d4",
    fontWeight:"bold"
  },
  title2: {
    flex:1,
    paddingVertical:10,
    //paddingHorizontal:8,
    //marginLeft:5,
    textTransform:"uppercase",
    fontSize: 20,
    color:"#0e66d4",
    fontWeight:"bold"
  },
  mainInformation: {
    flex:1,
    //padding:10,
   flexDirection:"row",
   justifyContent:"center",
  // marginBottom:5
 },
  icon: {
    paddingVertical:10,
    paddingHorizontal:20
  },
  link: {
    color:"red",
    margin:10,
  }
});


export default ListClients;

