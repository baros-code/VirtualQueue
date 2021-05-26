import React, { useState,useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Button, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; 
import { firebase } from '../firebase/config'
import { AuthContext } from '../Authentication/AuthContext'; 


const MyQueues = ( {navigation} ) => {
    const { userToken } = useContext(AuthContext);

    const USER_ID = userToken.uid;

    // state = queues[]
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
                <TouchableOpacity onPress={() => navigation.push("ListClients", {queueId: item.id})}>
                <View style={styles.row}> 
                    <FontAwesome style={styles.icon} name="users" size={50} color="#0e66d4" />
                    <Text style={styles.title}>{item.transactionType}</Text>
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
  row: {
    flex:1,
    flexDirection: 'row',
    justifyContent:"center",
    padding:5,
    backgroundColor:"white",
    marginTop:30,
    borderRadius:25,
    borderColor: 'gray',
  },
  title: {
    paddingVertical:10,
    paddingHorizontal:20,
    marginLeft:5,
    textTransform:"uppercase",
    fontSize: 26,
    color:"#0e66d4",
    fontWeight:"bold"
  },
  icon: {
    paddingVertical:10,
    paddingHorizontal:20
  },
  link: {
    color:"red",
    fontSize:20,
    margin:10,
  }
});


export default MyQueues;

