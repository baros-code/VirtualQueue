import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Button, TouchableOpacity } from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons'; 
import { firebase } from '../firebase/config'
import { startSession, endSession, startAlert, endAlert } from './ClientDetails'

const compareTwoDate = (r1,r2) => {
  const s1 = r1.date;
  const s2 = r2.date;
  const d1 = new Date(s1);
  const d2 = new Date(s2);
  if(d1.valueOf() > d2.valueOf())
      return 1;
  if(d1.valueOf() < d2.valueOf())
      return -1;
  return 0;
};


const EmployeeDashboard = ( {navigation} ) => {


  // state = reservations[]
  const [ state, setState ] = useState([]);

  const currentReservation = state[0];

  const USER_ID = navigation.getParam("uid");


  const addClientData = async (reservations) => {
    const ref = await firebase.database().ref("users");
    const result = [];
    await ref.once("value", function (users) {
      users.forEach( user => {
        let currentUser = user.val();
        currentUser.id = user.key;
        reservations.forEach( reservation => {
          if (reservation.clientId === currentUser.id)
              result.push({...reservation, client: currentUser})
        });
      });
    });
    return result;    
  };

  const findQueues = async () => {
    const ref = await firebase.database().ref("queues");
    let response = [];
    await ref.once("value", function (queues) {
      queues.forEach( queue => {
        let currentQueue = queue.val();
        currentQueue.id = queue.key;
        if (currentQueue.employeeId == USER_ID) {
          response.push(currentQueue.id);
        }
      });
    });
    return response;
  }


  //orderby(date), getfirst one.
  useEffect(() => {
    const fetchReservations= async (queues) => { 
      const reservationsReference=await firebase.database().ref("reservations")
      let response=[]; 
      reservationsReference.once("value",function (reservations) {
        reservations.forEach( reservation => {
            let currentReservation=reservation.val()
            currentReservation.id=reservation.key;
            if (queues.includes(currentReservation.queueId) && currentReservation.status.toString() !== "2") {            //If the reservation is in the employee's queue
              response.push(currentReservation);             
            }
            
        });
        addClientData(response).then(result => {
          result.sort(function (r1, r2) {return compareTwoDate(r1,r2)});        //order by date ascending
          setState(result);
        });
      });
      
    }
    findQueues().then(queues => {
      fetchReservations(queues);
    });
    },([state]));


  if(currentReservation) {
    return (
      <View style={styles.background}>
          <TouchableOpacity onPress={() => navigation.navigate("ClientDetails", {uid: USER_ID, reservation: currentReservation})}>
            <View style={styles.row}>     
              <View style={styles.content}>
                  <Text style={styles.title}>{currentReservation.transactionType} -  {currentReservation.date }  </Text> 
                  <View style={styles.buttons}>
                      <TouchableOpacity  onPress={() => endAlert(endSession(currentReservation.id))}>
                          <AntDesign size={10} color= "red" style={styles.icon}name="closecircleo" />
                      </TouchableOpacity>
                      <TouchableOpacity style={{paddingLeft: 20}} onPress={() => startAlert(startSession(currentReservation.id, USER_ID ))}>
                          <Feather size={5} color= "green" style={styles.icon} name="check-circle" />
                      </TouchableOpacity>
                  </View>

              </View>
            </View>
          </TouchableOpacity>
          <View style={{margin: 20}}>
            <Button title="MY QUEUES" onPress={() => navigation.navigate("EmployeeMyQueues", {uid: USER_ID})}/>
          </View>
      </View>
      
      );
  }
  else {
    return (
      <View style={styles.background}>
        <Text style={styles.title}>NO RESERVATION FOUND!</Text>
      </View>
    );
  };
};



EmployeeDashboard.navigationOptions = ( {navigation} ) => {
  return {
    headerRight: () => (
      <TouchableOpacity onPress={() => navigation.navigate('CreateQueue')}>
        <Feather style={styles.icon} name="plus" size={30} />
      </TouchableOpacity>
    ),
  };
};


const styles = StyleSheet.create({
  background: {
    backgroundColor: '#047DB9',
    color:"white"
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderColor: 'gray',
    color:"white"
  },
  content: {
      flexDirection: 'row',
  },
  buttons: {
    flexDirection: 'row',
    marginHorizontal: 20,

  },
  title: {
    fontSize: 18,
    color:"white"
  },
  icon: {
    fontSize: 24,
    color:"white"
  },
  link: {
    color: 'red',
    margin: 10
  },
});


export default EmployeeDashboard;
