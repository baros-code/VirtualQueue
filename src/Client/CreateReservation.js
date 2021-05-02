import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import ReservationForm from '../components/ReservationForm';
import { firebase } from '../firebase/config'

const CreateReservation = ({ navigation }) => {
    //const { addReservation } = useContext(ReservationContext);
    //const { addClientToQueue } = useContext(QueueContext);

    const clientName = navigation.getParam('clientName');
    const organizationName = navigation.getParam('name');
    const clientId = navigation.getParam('clientId');

    console.log("sa" + clientId, clientName, organizationName);


    const addReservation = async (clientId, transactionType, date, organizationName, callback) => {

        var ref = await firebase.database().ref("reservations").push();      //push sayesinde unique key'li branch olarak ekliyor.
        await ref.set({
        date: {
            day: date,
            month: date,
            year: date,
            time: date
        },
        clientId: clientId,
        employeeId: "userId3",
        estimatedRemainingTimeSec: "300",
        startTime: "14.30",
        finishTime: "14.45",
        organizationId: organizationName,
        queueId: "queueId2",
        status: "2",
        transactionType: transactionType
        });
        callback(); //navigate
    }



    if(organizationName) {
        return (
            <ReservationForm
            initialValues={{organizationName: organizationName, transactionType: ''}} 
            onSubmit={(transactionType, date, organizationName) => { addReservation(clientId, transactionType, date, organizationName, () => navigation.navigate('ClientDashboard'))}}
            />
        );
    }
    return (
        <ReservationForm 
        onSubmit={(transactionType, date, organizationName) => { addReservation(clientId, transactionType, date, organizationName, () => navigation.navigate('ClientDashboard') )}}
        />
    );
};


CreateReservation.navigationOptions = ( ) => {
    return {
      title: 'Create Reservation'
    };
};

const styles = StyleSheet.create({});


export default CreateReservation;