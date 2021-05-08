import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import ReservationForm from '../components/ReservationForm';
import { firebase } from '../firebase/config'

const CreateReservation = ({ navigation }) => {

    const serviceType = navigation.getParam('serviceType');
    const organizationId = navigation.getParam('organizationId');       //selected organization to enqueue
    const organizationName = navigation.getParam('organizationName');       
    const clientId = navigation.getParam('clientId');

    console.log("From CreateReservation: " + clientId, organizationId, organizationName);


    const addReservation = async (clientId, transactionType, date, organizationName, callback) => {

        var ref = await firebase.database().ref("reservations").push();      //push sayesinde unique key'li branch olarak ekliyor.
        await ref.set({
        date: date,
        clientId: clientId,
        employeeId: "userId3",
        estimatedRemainingTimeSec: "300",
        organizationId: organizationName,
        queueId: "queueId2",
        status: "2",
        transactionType: transactionType
        });
        callback(); //navigate
    }

    return (
        <ReservationForm
        initialValues={{organizationName: organizationName, transactionType: ''}} 
        onSubmit={(transactionType, date, organizationName) => { addReservation(clientId, transactionType, date, organizationName, () => navigation.navigate('ClientDashboard'))}}
        type={serviceType}
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