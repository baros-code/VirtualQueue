import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert, TouchableOpacity } from 'react-native';
import { isAllowedRemaining, getCurrentTime,lockTheRemaining, addMinutes, findSlotInterval, unLockTheRemaining, lockForEmployee, unLockForEmployee} from '../ExternalComponents/DateOperations';
import { firebase } from '../firebase/config'


const ClientDetails = ({ navigation }) => {
    //const [state, setState]= useState({});


    const USER_ID = navigation.getParam("uid");
    //const reservationId = navigation.getParam('reservationId');
    const reservation = navigation.getParam('reservation'); 

    // useEffect(()  => {
    //     const fetchReservationAndClient = async () => {
    //         try {
    //             setState(state);
    //             const ref = await firebase.database().ref("reservations/"+ reservationId);
    //             var response;
    //             await ref.get().then(reservation => {   
    //                 response = reservation.val();
    //                 response.id = reservation.key;
    //                 getClientData(clientId).then(client => {
    //                     response.client = client;
    //                     setState(response);
    //                 });
    //             });
                
    //         } catch (e) {
    //             console.log(e);
    //             setState(state);
    //         }
    //     };
    //     fetchReservationAndClient();
    //   }, []);


    if(reservation.client) {
        return (
            <View>
                <Text style={styles.label}>Client name: {reservation.client.fullName}</Text>
                <Text style={styles.label}>Client mail: {reservation.client.email}</Text>
                <Text style={styles.label}>Reservation Number: {reservation.id}</Text>
                <Text style={styles.label}>Transaction Type: {reservation.transactionType}</Text>
                <Text style={styles.label}>Reservation Date: {reservation.date}</Text>
                <View style={styles.button}>
                    <View style={styles.button2}>
                    <Button  color='red' title="Finish" disabled={reservation.status !== 1} onPress={() => endAlert(endSession(reservation.id, () => {navigation.pop()} )) }/>
                    </View>
                    <Button  color='green' title="Start" disabled={reservation.status !== 0} onPress={() => startAlert(startSession(reservation.id, USER_ID, () => {navigation.pop()} )) }/>
                </View>
                    
            </View>
            );
    }
    else{
        return (
            <View>
                <Text>NO DATA FOUND!</Text>
            </View>
        )
    }
        
};

export const startAlert = ( action ) =>
    Alert.alert(
    "Session Started!",
    "Directing to the Dashboard",
    [
        { text: "OK", onPress: () => action}
    ]
    );

export const endAlert = ( action ) =>
Alert.alert(
"Session Finished!",
"Directing to the Dashboard",
[
    { text: "OK", onPress: () => action}
]
);

ClientDetails.navigationOptions = ( ) => {
    return {
      title: 'Client Details'
    };
  };
  

export const getClientData = async (clientId) => {
    const ref = await firebase.database().ref("users/"+ clientId);
    var response;
    ref.get().then(user => {
        response = user.val();
        response.id = user.key;
        return response;
    });
};

export const startSession = async (reservationId, userId, callback) => {
    //await lockForEmployee(reservationId);
    let allowed=await isAllowedRemaining(reservationId)
    while (!allowed) {};
    await lockTheRemaining(reservationId);
    const ref = await firebase.database().ref("reservations/" + reservationId);
    ref.once("value" , (reservation) => {
        let queueId=reservation.val().queueId
        let currentTime=getCurrentTime()
        findSlotInterval(queueId).then((slotInterval)=> {ref.update({
            status : 1,
            employeeId: userId,
            startTime:currentTime,
            expectedFinishTime:addMinutes(slotInterval,currentTime)
            
        });})
    })
    await unLockTheRemaining(reservationId)
    //await unLockForEmployee(reservationId)
    if(callback)
        callback();
};

export const endSession = async (reservationId, callback) => {
   // await lockForEmployee(reservationId);
    let allowed=await isAllowedRemaining(reservationId)
    while (!allowed) {};
    await lockTheRemaining(reservationId);
    const ref = await firebase.database().ref("reservations/" + reservationId);
    let currentTime=getCurrentTime()
    ref.update({
        status : 2,
        finishTime: currentTime
    });
    await unLockTheRemaining(reservationId)
  //  await unLockForEmployee(reservationId)
    if(callback)
        callback();
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