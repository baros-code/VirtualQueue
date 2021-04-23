import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Button } from 'react-native';
import { Context as ReservationContext } from '../context/ReservationContext'  //context object
//import { Context as ImageContext } .....
import { Feather } from '@expo/vector-icons'; 

var CLIENT_ID = Math.floor((Math.random() * 10000) + 1);

const CLIENT_NAME = "BARAN ATEŞ"; 

const ClientDashboard = ( {navigation} ) => {

  //console.log("ReservationContext is : " + ReservationContext);

  const { state, deleteReservation } = useContext(ReservationContext);

  CLIENT_ID = Math.floor((Math.random() * 10000) + 1);
  console.log("id: "+ CLIENT_ID);
  //deneme2
    
  return (
  <View style={styles.background}>
    <FlatList
      data={state}
      keyExtractor={(reservation) => reservation.id.toString()}
      renderItem={({item}) => {
        return (
        <TouchableOpacity onPress={() => navigation.navigate("Details", {id: item.id})}>
          <View style={styles.row}>     
            <Text style={styles.organizationStyle}>{item.organizationName} - {item.date}</Text>
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
};

/*Whenever React renders ClientDashboard, react-navigation automatically
calls the navigationOptions function.
 */

ClientDashboard.navigationOptions = ( {navigation} ) => {
  return {
    headerRight: () => (
      <TouchableOpacity onPress={() => navigation.navigate('Organizations', {clientId: CLIENT_ID, clientName: CLIENT_NAME} )}>
        <Feather style={styles.icon} name="plus" size={30} />
      </TouchableOpacity>
    ),
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

