import React, { useEffect, useState ,useContext } from 'react';

import { View, Text, StyleSheet, FlatList, TouchableOpacity, Button } from 'react-native';
import { Context as ReservationContext } from '../context/ReservationContext'  //context object
//import { Context as ImageContext } .....
import { Feather } from '@expo/vector-icons'; 
import { firebase } from '../firebase/config'


const fetchReservations =  (clientId) => {
    const ref =firebase.database().ref("reservations");
            var response = [];
            ref.orderByChild("clientId").equalTo(clientId).on("child_added", function (snapshot) {
              response = [...response, snapshot.val()];
            });
            return response;
};
 

/*
ŞU AN LOGINDEN SONRA HEMEN ÇEKMIYOR, DASHBOARD EKRANINDA KODU TEKRAR SAVELEYINCE(RE-RENDER YAPINCA YANI) GETİRİYOR REZERVASYONLARI XDDD 
onWillFocus metodu kullanırsak sayfa geçişi olduğu zaman updated data var ise tekrar render çalıştırıyor */

const ClientDashboard = ( {navigation} ) => {

  //console.log("ReservationContext is : " + ReservationContext);

  const { deleteReservation } = useContext(ReservationContext);

  const USER_ID = navigation.getParam("uid");

  const [state, setState] = useState({reservations: [], dataIsReturned: false});
 
   
  
  useEffect(()  => {
    const fetchReservations =  () => {
        try {
            setState({reservations: state.reservations, dataIsReturned: false});
            //const response = await axios.get(USER_SERVICE_URL);
            const ref =firebase.database().ref("reservations");
            var response = [];
            ref.orderByChild("clientId").equalTo(USER_ID).on("child_added", function (snapshot) {
              response = [...response, {...snapshot.val(), id: snapshot.key} ];
            });
            setState({reservations: response, dataIsReturned: true});
            
        } catch (e) {
            console.log(e);
            setState({reservations: state.reservations, dataIsReturned: false});
        }
    };
    fetchReservations();
  }, []);


 
  // if(state.reservations[0] != undefined)
  //     console.log("RESERVATIONNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN: " + state.reservations[0].id);


  if (state.dataIsReturned) {
    return (
      <View style={styles.background}>
        <FlatList
          data={state.reservations}
          keyExtractor={(reservation) => reservation.id.toString()}
          renderItem={({item}) => {
            return (
            <TouchableOpacity onPress={() => navigation.navigate("Details", {id: item.id})}>
              <View style={styles.row}>     
                <Text style={styles.organizationStyle}>{item.organizationId} - {`${item.Date}/${item.Date}/${item.Date} - ${item.Date}`}</Text>
                <TouchableOpacity onPress={() => deleteReservation(item.transactionType)}>
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

