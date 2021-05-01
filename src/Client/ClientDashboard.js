import React, { useEffect, useState ,useContext } from 'react';

import { View, Text, StyleSheet, FlatList, TouchableOpacity, Button } from 'react-native';
import { Context as ReservationContext } from '../context/ReservationContext'  //context object
//import { Context as ImageContext } .....
import { Feather } from '@expo/vector-icons'; 
import { firebase } from '../firebase/config'


// const fetchReservations = (clientId) => {
//       const ref =firebase.statebase().ref("reservations");
//       ref.orderByChild("clientId").equalTo(clientId).on("child_added", snapshot => {
//            state = snapshot.val();
//            console.log(state);
//            return state;
//       });
// };


const ClientDashboard = ( {navigation} ) => {

  //console.log("ReservationContext is : " + ReservationContext);

  const { deleteReservation } = useContext(ReservationContext);

  const [state, setState] = useState({reservations: [], isFetching: false});

  useEffect(() => {
    const fetchReservations = async () => {
        try {
            setState({reservations: state.reservations, isFetching: true});
            //const response = await axios.get(USER_SERVICE_URL);
            const ref =firebase.database().ref("reservations");
            ref.orderByChild("clientId").equalTo("userId2").on("child_added", snapshot => {
              const response = snapshot.val();
              console.log("HEYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY");
              setState({reservations: response, isFetching: false});
         });
            
        } catch (e) {
            console.log(e);
            setState({reservations: state.reservations, isFetching: false});
        }
    };
    fetchReservations();
  }, []);

  console.log("reservations: " + state.reservations.startTime);
  //console.log("reservations: " + state.reservations[0].organizationId);
  
  return (
  <View style={styles.background}>
    {/* <FlatList
      state={state.reservations}
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
    /> */}
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
      <TouchableOpacity onPress={() => navigation.navigate('Organizations', {clientId: navigation.getParam("uid"), clientName: navigation.getParam("fullName")} )}>
        <Feather style={styles.icon} name="plus" size={30} />
      </TouchableOpacity>
    ),
    title: "Hello, " + navigation.getParam("fullName") + navigation.getParam("uid"),
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

