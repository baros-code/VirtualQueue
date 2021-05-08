import React, { useState,useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Button, TouchableOpacity } from 'react-native';
import { Feather,AntDesign } from '@expo/vector-icons'; 
import { firebase } from '../firebase/config'


const AdminDashboard = ( {navigation} ) => {

  const adminId=navigation.getParam("uid");
  const [queues, setQueues] = useState([])

  const deleteQueue = (id) => {
    const ref = firebase.database().ref("queues");   
    ref.child(id).remove();         //if not found exception eklenmeli.
    setQueues(queues.filter(queue => {return id !== queue.id}))

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
              if (currentIdAdmin === adminId) {
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
    (<FlatList
      data={queues}
      keyExtractor={(queue) => queue.id}
      renderItem={({item}) => {
        return (
        <TouchableOpacity onPress={() => navigation.navigate("QueueForm", {queueId: item.id,adminId:adminId,editPage:true})}>
          <View style={styles.row}>     
            <Text style={styles.title}>{item.transactionType} - {item.employee}</Text>
            <TouchableOpacity onPress={() => deleteQueue(item.id)}>
            <AntDesign name="delete" size={24} color="#0e66d4"  />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
        );
      }}
    /> ) : (<Text>No queues found </Text>)}
  </View>
  );
};


AdminDashboard.navigationOptions = ( {navigation} ) => {
  const adminId=navigation.getParam("uid");
  const organizationId=navigation.getParam("organizationId")
  return {
    headerRight: () => (
      <TouchableOpacity onPress={() => navigation.navigate('QueueForm',{queueId:"",adminId:adminId, organizationId:organizationId,editPage:false})}>
        <Feather  name="plus" size={30} color="#0e66d4" />
      </TouchableOpacity>
    ),
    title: "Hello " + navigation.getParam("fullName")
  };
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


export default AdminDashboard;

