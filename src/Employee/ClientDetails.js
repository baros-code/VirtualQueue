import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';



const ClientDetails = ({ navigation }) => {
    const [state, setState]= useState([]);


    const id = navigation.getParam('id');

    // state === [] of clients
    const client = state.find((client) => client.id === id);

    if(client) {
        return (
            <View>
                <Text style={styles.label}>Client name: {client.name}</Text>
                <Text style={styles.label}>Client mail: {client.email}</Text>
                <Text style={styles.label}>Reservation Number: {client.reservation.id}</Text>
                <Text style={styles.label}>Transaction Type: {client.reservation.transactionType}</Text>
                <View style={styles.button}>
                    <View style={styles.button2}>
                    <Button  color='red' title="Reject" onPress={() => rejectUser(client.id, () => {navigation.pop()} ) }/>
                    </View>
                    <Button  color='green' title="Accept" onPress={() => acceptUser(client.id, () => {navigation.pop()} ) }/>
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

ClientDetails.navigationOptions = ( ) => {
  return {
    title: 'Client Details'
  };
};


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
        flexDirection: 'row',
        alignSelf: 'flex-end',
        marginRight: 10,
    },
    button2: {
        marginRight: 250
    }
});


export default ClientDetails;