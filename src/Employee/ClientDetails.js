import React, { useContext } from 'react';
import { View, Text, StyleSheet, Button, Alert, TouchableOpacity } from 'react-native';
import { isAllowedRemaining, getCurrentTime,lockTheRemaining, addMinutes, findSlotInterval, unLockTheRemaining, lockForEmployee, unLockForEmployee} from '../ExternalComponents/DateOperations';
import { firebase } from '../firebase/config'
import { AuthContext } from '../Authentication/AuthContext'; 

const ClientDetails = ({ navigation, route }) => {

    const { userToken } = useContext(AuthContext);

    const USER_ID = userToken.uid;

    const reservation = route.params.reservation;

    if(reservation.client) {
        return (
            <View>
                <Text style={styles.label}>Client name: {reservation.client.fullName}</Text>
                <Text style={styles.label}>Client mail: {reservation.client.email}</Text>
                <Text style={styles.label}>Reservation Number: {reservation.id}</Text>
                <Text style={styles.label}>Transaction Type: {reservation.transactionType}</Text>
                <Text style={styles.label}>Reservation Date: {reservation.date}</Text>
                {userToken.role === 1 ? <View style={styles.button}>
                    <View style={styles.button2}>
                    <Button  color='red' title="Finish" disabled={reservation.status !== 1} onPress={() => endAlert(endSession(reservation.id,USER_ID)) }/>
                    </View>
                    <Button  color='green' title="Start" disabled={reservation.status !== 0} onPress={() => startAlert(startSession(reservation.id, USER_ID)) }/>
                </View> : <Text style={styles.label}>Assigned Employee: {reservation.employeeId}</Text>}                    
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

export const startAlert = (resId,userId) =>
    Alert.alert(
    "Session Started!",
    "Directing to the Dashboard",
    [
        { text: "OK", onPress: async () => {await startSession(resId,userId)}}
    ]
    );

export const endAlert = ( resId,userId ) =>
Alert.alert(
"Session Finished!",
"Directing to the Dashboard",
[
    { text: "OK", onPress: async () => {await endSession(resId,userId)}}
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

export const startSession = async (reservationId, userId) => {
    //await lockForEmployee(reservationId);
    let allowed=await isAllowedRemaining(reservationId)
    while (!allowed) {};
    console.log("reservastion id :" + reservationId)
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
    
};

export const endSession = async (reservationId) => {
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