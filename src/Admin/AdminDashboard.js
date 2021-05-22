import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Button, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons'; 
import { firebase } from '../firebase/config'
import { AuthContext } from '../Authentication/AuthContext'; 

const AdminDashboard = ( {navigation} ) => {

  const { userToken } = useContext(AuthContext);

  const USER_ID = userToken.uid;

  const [queues, setQueues] = useState([])
  const organizationId=navigation.getParam("organizationId")

  const deleteQueue = (id) => {
    // const ref = firebase.database().ref("queues");   
    // ref.child(id).remove();         //if not found exception eklenmeli.

  }


  useEffect(() => {
    const fetchQueues=async () => { 
      const queuesReference=await firebase.database().ref("queues/")
      let newQueues=[]  
      await queuesReference.once("value",function (queuesSnapShot) {
          queuesSnapShot.forEach( queueSnapShot => {
              let currentQueue=queueSnapShot.val()
              currentQueue.id=queueSnapShot.key
              let currentIdAdmin=currentQueue.adminId
              if (currentIdAdmin === USER_ID) {
                newQueues.push(currentQueue)                 
              }
          });
          setQueues(newQueues)
      })     
  }
  fetchQueues()
  },([queues]))

  return (
    
  <View>
    {queues.length !== 0 ? 
    <FlatList
      data={queues}
      keyExtractor={(queue) => queue.id}
      renderItem={({item}) => {
        return (
        <TouchableOpacity onPress={() => navigation.push("ListClients", {queueId: item.id})}>
          <View style={styles.row}>     
            <Text style={styles.title}>{item.transactionType} - {item.employeeName}</Text>
            <View style={{paddingRight: 25}}>
              <TouchableOpacity onPress={() => navigation.push("QueueForm", {queueId: item.id}) }>
                <Feather name="settings" size={32} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
        );
      }}
    />  : <Text style={styles.text}>No queues found </Text>}
  </View>
  );
};


const styles = StyleSheet.create({
  background: {
    backgroundColor: 'white',
    color:"white"
  },
  text: {
    color:"white",
    fontSize:25
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
  link: {
    color:"red",
    fontSize:20,
    margin:10,
  }
});


export default AdminDashboard;

