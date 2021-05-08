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

    const findQueue = async (transactionType) => {
        var ref = await firebase.database().ref("queues");   
        var response;
        await ref.once("value",function (queues) {
          queues.forEach( queue => {
              let currentQueue = queue.val();
              currentQueue.id = queue.key;
              if(currentQueue.organizationId === organizationId && currentQueue.transactionType === transactionType) {
                  response = currentQueue;
                  return true;      //end forEach
              }
          });
      }); 
      return response;
    }

    const addReservation = async (clientId, transactionType, date, callback) => {

        var ref = await firebase.database().ref("reservations").push();      //push sayesinde unique key'li branch olarak ekliyor.
        findQueue(transactionType).then(response => {
            if(response) {
                ref.set({
                    date: date,
                    clientId: clientId,
                    employeeId: "userId3",
                    estimatedRemainingTimeSec: "300",
                    organizationId: organizationId,
                    organizationName: organizationName,
                    queueId: response.id,
                    status: "2",
                    transactionType: transactionType
                    });
                callback(); //navigate
            }else {
                console.log("-----------------------------QUEUE NOT FOUND!------------------------------");
            }
        });
    };

    return (
        <ReservationForm
        initialValues={{organizationName: organizationName, transactionType: ''}} 
        onSubmit={(transactionType, date) => { addReservation(clientId, transactionType, date, () => navigation.navigate('ClientDashboard'))}}
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