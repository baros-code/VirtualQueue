import React, { useEffect, useState } from 'react';

import { View, Text, StyleSheet, FlatList, TouchableOpacity, Button } from 'react-native';
import { Feather } from '@expo/vector-icons'; 
import { firebase } from '../firebase/config'



  
/*
ŞU AN LOGINDEN SONRA HEMEN ÇEKMIYOR, DASHBOARD EKRANINDA KODU TEKRAR SAVELEYINCE(RE-RENDER YAPINCA YANI) GETİRİYOR REZERVASYONLARI XDDD 
onWillFocus metodu kullanırsak sayfa geçişi olduğu zaman updated data var ise tekrar render çalıştırıyor */

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
        <FlatList
          data={state}
          keyExtractor={(reservation) => reservation.id.toString()}
          renderItem={({item}) => {
            return (
            <TouchableOpacity onPress={() => navigation.navigate("Details", {id: item.id})}>
              <View style={styles.row}>     
                <Text style={styles.organizationStyle}>{item.organizationId} - {`${item.date.day}`}</Text>
                <TouchableOpacity onPress={() => deleteReservation(item.id)}>
                  <Feather style={styles.icon} name="trash" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
            ); 
          }}
        />
        <View style={styles.button}>
        <Button title="Go to Admin Dashboard" onPress={() => navigation.navigate("AdminDashboard")} />
        </View>
        <Button title="Go to Employee Dashboard" onPress={() => navigation.navigate("EmployeeDashboard")} />
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
        <Feather style={styles.icon} name="plus" size={30} />
      </TouchableOpacity>
    ),
    title: "Hello, " + navigation.getParam("fullName"),
  };
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#047DB9'
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
    fontSize: 24,
  },
  button: {
    marginVertical: 20,
  }
});


export default ClientDashboard;

