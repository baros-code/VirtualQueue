import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { compareTwoTime, getCurrentTime } from '../ExternalComponents/DateOperations';
import { firebase } from '../firebase/config'
import { deleteReservation } from './ClientDashboard'


const ReservationDetails = ({ navigation, route }) => {

    const [state, setState] = useState({});

    const id = route.params.id;



    useEffect(()  => {
        const fetchReservation = async () => {
            try {
               // setState({state});
                //const response = await axios.get(USER_SERVICE_URL);
                const ref = await firebase.database().ref("reservations/"+ id);
                var response = {};
                await ref.get().then(reservation => {
                    response = reservation.val();
                }) 
                setState(response);
                
            } catch (e) {
                console.log(e);
                setState(state);
            }
        };
        fetchReservation();
      }, []);
 
    
    if(state) {
        return (
            <View>
                <Text style={styles.label}>Organization: {state.organizationName}</Text>
                <Text style={styles.label}>Reservation Date: {state.date}</Text>
                <Text style={styles.label}>Reservation Time: {state.time}</Text>
                <Text style={styles.label}>Reservation Number: {id}</Text>
                <Text style={styles.label}>Transaction Type: {state.transactionType}</Text>
                <View style={styles.button}>
                    <Button  color='red' title="Cancel" onPress={() => createTwoButtonAlert(deleteReservation, navigation, route) }/>
                </View>
            </View>
            );
    }
    else{
        return (
            <View>Nothing here</View>
        )
    }
        
};

ReservationDetails.navigationOptions = ( ) => {
  return {
    title: 'Reservation Details'
  };
};

const createTwoButtonAlert = ( action, navigation, route ) =>
    Alert.alert(
    "Confirmation",
    "Are you sure you want to cancel the reservation?",
    [
        { text: "Cancel", onPress: () => navigation.navigate('ReservationDetails',{id: route.params.id }) },
        { text: "OK", onPress: async () => {await action(route.params.id, navigation)} }
    ]
    );

const styles = StyleSheet.create({
    icon: {
        fontSize: 24
    },
    label: {
        fontSize: 18,
        borderWidth: 1,
        borderColor: 'black',
        marginBottom: 15,
        padding: 5,
        margin: 5,
        color: 'white'
    },
    button: {
        alignSelf: 'flex-end',
        marginRight: 10
    }
});


export default ReservationDetails;