import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { Context as ReservationContext } from '../context/ReservationContext';
import { Context as QueueContext } from '../context/QueueContext'
import ReservationForm from '../components/ReservationForm';

const CreateReservation = ({ navigation }) => {
    const { addReservation } = useContext(ReservationContext);
    const { addClientToQueue } = useContext(QueueContext);

    const clientName = navigation.getParam('clientName');
    const organizationName = navigation.getParam('name');
    const clientId = navigation.getParam('clientId');

    console.log("sa" + clientId, clientName, organizationName);
    //console.log("saaa");

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