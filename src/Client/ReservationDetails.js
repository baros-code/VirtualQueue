import React, { useContext } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { Context as ReservationContext } from '../context/ReservationContext';


const ReservationDetails = ({ navigation }) => {
    const { state, deleteReservation } = useContext(ReservationContext);

    const id = navigation.getParam('id');

    // state === [] of reservations
    const reservation = state.find((reservation) => reservation.id === id);

    if(reservation) {
        return (
            <View>
                <Text style={styles.label}>Organization: {reservation.organizationName}</Text>
                <Text style={styles.label}>Date and Time: {reservation.date}</Text>
                <Text style={styles.label}>Reservation Number: {reservation.id}</Text>
                <Text style={styles.label}>Transaction Type: {reservation.transactionType}</Text>
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
        { text: "OK", onPress: () => action(navigation.getParam('id'), () => navigation.navigate('Dashboard'))}
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