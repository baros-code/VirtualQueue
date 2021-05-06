import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { firebase } from '../firebase/config'

const ReservationDetails = ({ navigation }) => {

    const [state, setState] = useState({reservation: {}, dataIsReturned: false});

    const deleteReservation = (id, callback) => {
        const ref = firebase.database().ref("reservations");   
        ref.child(id).remove();         //if not found exception eklenmeli.
      
        setState(state.filter(reservation => {return reservation.id !== id} ) );
        
        callback();     //navigate to dashboard
      
      }
 
    const id = navigation.getParam('id');
    // const reservation = state.find((reservation) => reservation.id === id);

    useEffect(()  => {
        const fetchReservation = async () => {
            try {
                setState({reservations: state.reservation, dataIsReturned: false});
                //const response = await axios.get(USER_SERVICE_URL);
                const ref = await firebase.database().ref("reservations/"+ id);
                var response = {};
                await ref.get().then(reservation => {
                    response = reservation.val();
                })
                console.log("RESERVATIONDETAILSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS: " + response);    
                setState({reservation: response, dataIsReturned: true});
                
            } catch (e) {
                console.log(e);
                setState({reservation: state.reservation, dataIsReturned: false});
            }
        };
        fetchReservation();
      }, []);
 
    
    if(state.dataIsReturned) {
        return (
            <View>
                <Text style={styles.label}>Organization: {state.reservation.organizationId}</Text>
                <Text style={styles.label}>Date and Time: {state.reservation.date.day}</Text>
                <Text style={styles.label}>Reservation Number: {id}</Text>
                <Text style={styles.label}>Transaction Type: {state.reservation.transactionType}</Text>
                <View style={styles.button}>
                    <Button  color='red' title="Cancel" onPress={() => createTwoButtonAlert(deleteReservation, navigation) }/>
                </View>
            </View>
            );
    }
    else{
        return (
            <View></View>
        )
    }
        
};

ReservationDetails.navigationOptions = ( ) => {
  return {
    title: 'Reservation Details'
  };
};

const createTwoButtonAlert = ( action, navigation ) =>
    Alert.alert(
    "Confirmation",
    "Are you sure you want to cancel the reservation?",
    [
        { text: "Cancel", onPress: () => navigation.navigate('Details',{id: navigation.getParam('id')}) },
        { text: "OK", onPress: () => action(navigation.getParam('id'), () => navigation.navigate('ClientDashboard'))}
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