import React, { useState,useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Button, TouchableOpacity } from 'react-native';
import { Feather,AntDesign } from '@expo/vector-icons'; 
import { firebase } from '../firebase/config'


const MyQueues = ( {navigation} ) => {

    const USER_ID =navigation.getParam("uid");

    const [state, setState] = useState([])
    
    useEffect(() => {
        const fetchQueues=async () => { 
        const ref=await firebase.database().ref("queues")
        let response=[]  
        await ref.once("value",function (queuesSnapShot) {
            queuesSnapShot.forEach( queueSnapShot => {
                let currentQueue=queueSnapShot.val()
                currentQueue.id=queueSnapShot.key
                if (currentQueue.employeeId === USER_ID) {
                    response.push(currentQueue)                 
                }
            });
            setState(response)
        })
        
        }
        fetchQueues()
    },([state]));



    if(state && state.length > 0) {
      return (  
        <View>
            <FlatList
            data={state}
            keyExtractor={(queue) => queue.id}
            renderItem={({item}) => {
                return (
                <TouchableOpacity onPress={() => navigation.navigate("ListClients", {uid: USER_ID, queueId: item.id})}>
                <View style={styles.row}>     
                    <Text style={styles.title}>{item.transactionType} - {item.employeeId}</Text>
                </View>
                </TouchableOpacity>
                );
            }}
            /> 
        </View>
      );
    }
    else {
      return (
        <View>
          <Text>THERE ARE NO QUEUES ASSIGNED TO YOU!</Text>
        </View>
      )
    }
 
  };




const styles = StyleSheet.create({
  background: {
    backgroundColor: 'white',
    color:"white"
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 35,
    paddingHorizontal: 10,
    backgroundColor:"white",
    marginTop:30,
    borderRadius:25,
    borderTopWidth: 1,
    borderColor: 'gray',
    color:"white"
  },
  title: {
    fontSize: 18,
    color:"#0e66d4"
  },
  icon: {
    fontSize: 24
  },
  link: {
    color:"red",
    fontSize:20,
    margin:10,
  }
});


export default MyQueues;

