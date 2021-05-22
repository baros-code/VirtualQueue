import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import ReservationForm from '../components/ReservationForm';
import { firebase } from '../firebase/config'
import { AuthContext } from '../Authentication/AuthContext';


const CreateReservation = ({ navigation, route}) => {

    const { userToken } = useContext(AuthContext);

    const serviceType = route.params.serviceType;
    const organizationId = route.params.organizationId;       //selected organization to enqueue
    const organizationName = route.params.organizationName;    

    console.log("From CreateReservation: " + userToken.uid, organizationId, organizationName);

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
                  //takeValue(response);        herhangi bir methoda argüman olarak verirsek promise dönebiliyor, alternatif return şekli.
              }
          });
      }); 
      return response;
    }

    const addReservation = async (transactionType, date, callback) => {

        var ref = await firebase.database().ref("reservations").push();      //push sayesinde unique key'li branch olarak ekliyor.
        findQueue(transactionType).then(response => {
            if(response) {
                ref.set({
                    date: date,
                    clientId: userToken.uid,
                    employeeId: "",
                    estimatedRemainingTimeSec: "300",
                    organizationId: organizationId,
                    organizationName: organizationName,
                    queueId: response.id,
                    status: 0,
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
        onSubmit={(transactionType, date) => { addReservation(transactionType, date, () => navigation.navigate('Home', {screen: 'Dashboard'}) )}}
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