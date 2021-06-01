import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Button, TouchableOpacity } from 'react-native';
import { Feather, AntDesign,FontAwesome5 } from '@expo/vector-icons'; 
import { startSession, endSession, startAlert, endAlert } from './ClientDetails'
import { firebase } from '../firebase/config'
import { AuthContext } from '../Authentication/AuthContext';
import { compareTwoDate, compareTwoTime, findCurrentReservation, getCurrentDate } from '../ExternalComponents/DateOperations';

const dateComparison = (r1,r2) => {
  let time1=r1.estimatedTime
  let time2=r2.estimatedTime
  return (compareTwoTime(time1,time2))
  /** 
  const s1 = r1.date;
  const s2 = r2.date;
  const d1 = new Date(s1);
  const d2 = new Date(s2);
  if(d1.valueOf() > d2.valueOf())
      return 1;
  if(d1.valueOf() < d2.valueOf())
      return -1;
  return 0;
  */
};


const EmployeeDashboard = ( {navigation} ) => {

  const { userToken } = useContext(AuthContext);

  const USER_ID = userToken.uid;

  // state = reservations[]
  const [ state, setState ] = useState([]);

  const currentReservation = state[0];

  


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
            let date=currentReservation.date
            let today=getCurrentDate()
            let isToday=(compareTwoDate(date,today,"/") === 0) // check reservation time is today
            if (queues.includes(currentReservation.queueId) && (currentReservation.status !== 3 && currentReservation !== 4) && isToday) {            //If the reservation is in the employee's queue
              //console.log(currentReservation)
              response.push(currentReservation);             
            }
            
        });
        addClientData(response).then(result => {
          findCurrentReservation(result).then(() => {
            result.sort(function (r1, r2) {return dateComparison(r1,r2)});        //order by date ascending
            setState(result);
          })
          
        });
      });
      
    }
    findQueues().then(queues => {
      fetchReservations(queues);
    });
    },([state]));


  if(currentReservation) {
    return (
       
          
        <TouchableOpacity onPress={() => navigation.push("ClientDetails", {reservation: currentReservation})}>
          <View style={styles.row}>   
             <FontAwesome5 style={styles.userIcon} name="user-clock" size={75} color="#0e66d4" />
              <View style={styles.content}>
                <View style={styles.mainInformation}>
                  <Text style={styles.title}>{currentReservation.transactionType}</Text>
                </View>
                <View style={styles.mainInformation}>
                  <Feather name="calendar" size={28} color="#0e66d4" />
                  <Text style={styles.title}>{currentReservation.date } </Text>
                </View>
                <View style={styles.mainInformation}>
                  <Feather name="clock" size={28} color="#0e66d4" />
                  <Text style={styles.title}>{currentReservation.time}</Text>
                </View>  
              </View>
          </View>
        </TouchableOpacity>
      );
  }
  else {
    return (
      <View style={styles.background}>
        <Text style={styles.title2}>NO RESERVATION FOUND!</Text>
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
  row: {
    flexDirection: 'row',
    justifyContent:"center",
    padding:5,
    backgroundColor:"white",
    marginTop:30,
    borderRadius:15,
    borderColor: 'gray',
  },
  content: {
    padding:10,
    flexDirection:"column",
    alignItems:"center",
    marginBottom:5
  },
  buttons: {
    flexDirection: 'row',
    marginHorizontal: 20,

  },
  title: {
    marginLeft:5,
    textTransform:"uppercase",
    fontSize: 23,
    color:"#0e66d4",
    fontWeight:"bold"
  },
  title2: {
    marginLeft:5,
    textTransform:"uppercase",
    fontSize: 23,
    color:"white",
    fontWeight:"bold"
  },
  userIcon: {
    padding:25
  },
  mainInformation: {
    padding:5,
   flexDirection:"row",
   justifyContent:"center",
   marginBottom:5
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
