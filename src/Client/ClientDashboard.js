import React, { useEffect, useState } from 'react';

import { View, Text, StyleSheet, FlatList, TouchableOpacity, Button } from 'react-native';
import { Feather } from '@expo/vector-icons'; 
import { firebase } from '../firebase/config'




const ClientDashboard = ( {navigation} ) => {

  const getStatus = (statusInteger) =>{
    if (statusInteger == 1) {
      return "Started"
    } else if (statusInteger == 0) {
      return "Not Started"
    } else {
      return "Unknown condition"
    }

  }

  const isBigger = (date1,date2) => {
      let dateList1=date1.split(":")
      let dateList2=date2.split(":")
      let d1=new Date()
      let d2=new Date()
      d1.setHours(dateList1[0],dateList1[1])
      d2.setHours(dateList2[0],dateList2[1])
      return (d1.getTime() > d2.getTime())
  }

  const USER_ID = navigation.getParam("uid");

  const [state, setState] = useState([]);

const findKey=async (time,date,queueId) => {
  const dateRef=await firebase.database().ref("queues/" + queueId + "/dates/" + date)
  let currentKey=0;
  let timeKey=0;
  await dateRef.get().then((data) => {
    data.forEach((timeData) => {
      let currentTime=timeData.val()
      console.log(currentTime)
      if (isBigger(currentTime,time)) {
          timeKey=currentKey
      } else {
        currentKey += 1
      }
    })
  })
  return timeKey
   
}

const addTimeToTheQueue = async (id) => {
  const reservation=await firebase.database().ref("reservations/" + id)
  await reservation.get().then((data) => {
      let reservationData=data.val()
      let date=reservationData.date.split("/").join("-")
      let time=reservationData.time
      let queueId=reservationData.queueId
      findKey(time,date,queueId).then((key) => {
        console.log(key)
        let updates={}
        updates["queues/" + queueId + "/dates/" + date + "/" + key] = time;
        firebase.database().ref().update(updates);
      })
      
     
  })

}

  const deleteReservation = async (id,popFlag) => {
    await addTimeToTheQueue(id)
    const ref = firebase.database().ref("reservations");   
    ref.child(id).remove();         //if not found exception eklenmeli.
  
    //setState(state.filter(reservation => {return reservation.id !== id} ) );
    if (popFlag) {
      navigation.pop()
    }
  
  }

    
  useEffect(()  => {
    const fetchReservations = async  () => {
     
        //  setState(state);
          const ref = await firebase.database().ref("reservations");
          var response = [];
          await ref.once("value",function (reservationsSnapShot) {
            reservationsSnapShot.forEach( reservationSnapShot => {
                let currentReservation = reservationSnapShot.val()
                currentReservation.id = reservationSnapShot.key;
                let clientId = currentReservation.clientId;
                if (clientId === USER_ID && currentReservation.status != 2) {
                  response.push(currentReservation)
                    
                }
            });
            setState(response);
        });       
       
  };
    fetchReservations();
  }, [state]);

 
    return (
      <View style={styles.background}>
        {state.length !== 0 ? <FlatList
          data={state}
          keyExtractor={(reservation) => reservation.id.toString()}
          renderItem={({item}) => {
            return (
            <TouchableOpacity onPress={() => navigation.navigate("Details", {id: item.id,deleteOperation:deleteReservation})}>
              <View style={styles.row}>     
                <Text style={styles.organizationStyle}>{item.organizationName}  {item.date}   {item.time}  ({getStatus(item.status)})</Text>
                <TouchableOpacity onPress={async () => deleteReservation(item.id,false)}>
                  <Feather style={styles.icon} name="trash" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
            ); 
          }}
        /> : <Text style={styles.text}>No reservations found!</Text>}
      </View>
      );

};

/*Whenever React renders ClientDashboard, react-navigation automatically
calls the navigationOptions function.
 */

ClientDashboard.navigationOptions = ( {navigation} ) => {
  return {
    headerRight: () => (
      <TouchableOpacity onPress={() => navigation.navigate('Services', {clientId: navigation.getParam("uid")} )}>
        <Feather  name="plus" color="#0e66d4" size={30} />
      </TouchableOpacity>
    ),
    title: "Hello, " + navigation.getParam("fullName"),
  };
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#0e66d4'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderColor: 'gray'
  },
  organizationStyle: {
    fontSize: 18,
    color: 'white'
  },
  icon: {
    fontSize: 24
  },
  button: {
    marginVertical: 20,
  },
  text: {
    fontSize: 24,
  }
});


export default ClientDashboard;

