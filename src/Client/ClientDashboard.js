import React, { useEffect, useState, useContext } from 'react';

import { View, Text, StyleSheet, FlatList, TouchableOpacity, Button ,Image} from 'react-native';
import { Feather,MaterialCommunityIcons } from '@expo/vector-icons'; 
import { firebase } from '../firebase/config'
import { AuthContext } from '../Authentication/AuthContext';
import { isAllowedRemaining, findCurrentReservation, lockTheRemaining, startRemainingTime, unLockTheRemaining} from "../ExternalComponents/DateOperations"
import {images} from "../images"
const ClientDashboard = ( {navigation} ) => {

  const { userToken } = useContext(AuthContext);

  const USER_ID = userToken.uid;

  const [state, setState] = useState([]);

  const getStatus = (statusInteger) =>{
    if (statusInteger == 1) {
      return "Started"
    } else if (statusInteger == 0) {
      return "Not Started"
    } else if (statusInteger === 2) {
      return "Finished"
    } else if (statusInteger === 4) {
      return "Cancelled"
    } else  {
      return "Unknown condition"
    }

  }


    
  useEffect(()  => {
    const fetchReservations = async  () => {
          const ref = await firebase.database().ref("reservations");
          var response = [];
          await ref.once("value",function (reservationsSnapShot) {
            reservationsSnapShot.forEach( reservationSnapShot => {
                let currentReservation = reservationSnapShot.val()
                currentReservation.id = reservationSnapShot.key;
                let clientId = currentReservation.clientId;
                if (clientId === USER_ID && (currentReservation.status !== 3 && currentReservation.status !== 4) ) {
                  //console.log(USER_ID)
                  response.push(currentReservation)
                }
            });
        findCurrentReservation(response).then(() => {
          setState(response); 
        })  
                   
      })
  };

    fetchReservations();

  }, [state]);

 
    return (
      <View>
        {state.length !== 0 ? <FlatList
          data={state}
          keyExtractor={(reservation) => reservation.id}
          renderItem={({item}) => {
            return (
            <TouchableOpacity onPress={() => navigation.push("ReservationDetails", {id: item.id})}>
              <View style={styles.row}> 
                <View style={{flexDirection:"column",alignItems:"center",paddingLeft:20}}> 
                  <Text style={styles.title2}>{item.organizationName}</Text>
                  <Image  style={styles.image} source={images.find(image => image.name === item.organizationName).image} />
                </View>
                <View style={{flexDirection:"column",alignItems:"center",paddingRight:20}}>
                  <View style={styles.mainInformation}>
                   <Feather name="calendar" size={28} color="#0e66d4" />
                    <Text style={styles.title1}> {item.date}</Text>
                  </View>
                  <View style={styles.mainInformation}>
                    <Feather name="activity" size={28} color="#0e66d4" />
                    <Text style={styles.title1}> {getStatus(item.status)}</Text>
                  </View>
                   <View style={styles.mainInformation}>
                    <Feather name="clock" size={28} color="#0e66d4" />
                  <Text style={styles.title1}> {item.time}</Text>
                  </View>
                  {item.status !== 1 && 
                  <View style={styles.mainInformation}>
                  <MaterialCommunityIcons name="timer-sand" size={28} color="#0e66d4" />
                  <Text style={styles.title1}>  {item.estimatedTime}</Text>
                  </View>}
                </View>
              </View>
            </TouchableOpacity>
            ); 
          }}
        /> : <Text style={styles.text}>No reservations found!</Text>}
      </View>
    );

};


const isTimeBigger = (date1,date2) => {
  let dateList1=date1.split(":")
  let dateList2=date2.split(":")
  let d1=new Date()
  let d2=new Date()
  d1.setHours(dateList1[0],dateList1[1])
  d2.setHours(dateList2[0],dateList2[1])
  return (d1.getTime() > d2.getTime())
}



const findKey=async (time,date,queueId) => {
    const dateRef=await firebase.database().ref("queues/" + queueId + "/dates/" + date)
    let currentKey=0;
    let timeKey=0;
    await dateRef.get().then((data) => {
    data.forEach((timeData) => {
      let currentTime=timeData.val()
      //console.log(currentTime)
      if (isTimeBigger(currentTime,time)) {
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
        //console.log(key)
        let updates={}
        updates["queues/" + queueId + "/dates/" + date + "/" + key] = time;
        firebase.database().ref().update(updates);
      }) 
  })
}


export const deleteReservation = async (id) => {
    let allowed=await isAllowedRemaining(id,"")
    if (!allowed) {return false};
    await lockTheRemaining(id,"");
    await addTimeToTheQueue(id)
    const ref = firebase.database().ref("reservations/" + id);   
    await ref.update({
      status:4,
      clientId:""
    })
    await unLockTheRemaining(id,"")  //if not found exception eklenmeli.
    return true
}


const styles = StyleSheet.create({
  row: {
    flex:1,
    flexDirection: 'row',
    justifyContent:"space-between",
    padding:5,
    backgroundColor:"white",
    marginTop:30,
    borderRadius:25,
    borderColor: 'gray',
  },
   mainInformation: {
     padding:10,
    flexDirection:"row",
    justifyContent:"center",
    marginBottom:5
  },
    title1: {
    textTransform:"uppercase",
    fontSize: 18,
    color:"#0e66d4",
    fontWeight:"bold"
  },
  title2: {
    padding:5,
    textTransform:"uppercase",
    fontSize: 23,
    color:"#0e66d4",
    fontWeight:"bold"
  },
  icon: {
    fontSize: 24
  },
  button: {
    marginVertical: 20,
  },
  text: {
    fontSize: 24,
    color:"white"
  },
  image: {
    width: 150,
    height: 150,
    borderWidth:2,
    borderRadius:10,
    borderColor:"#0e66d4",
  }

});


export default ClientDashboard;

