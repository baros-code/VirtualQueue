import React, { useState,useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Button, TouchableOpacity } from 'react-native';
import { Feather,AntDesign } from '@expo/vector-icons'; 
import { firebase } from '../firebase/config'


const AdminDashboard = ( {navigation} ) => {

 // const adminId=navigation.getParams("userId");
  const adminId="userId5"
  const [queues, setQueues] = useState([])

  const fetchQueues=async () => {
      const queuesReference=await firebase.database().ref("queues/")
      console.log(queuesReference)
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

  useEffect(() => {
      fetchQueues()
  },([]))

  return (
  <View>
    {queues.length !== 0 ? 
    (<FlatList
      data={queues}
      keyExtractor={(queue) => queue.id}
      renderItem={({item}) => {
        return (
        <TouchableOpacity onPress={() => navigation.navigate("QueueDetails", {id: item.id})}>
          <View style={styles.row}>     
            <Text style={styles.title}>{item.transactionType} - {item.latencySec}</Text>
            <TouchableOpacity onPress={() => deleteQueue(item.id)}>
            <AntDesign name="delete" size={24} color="#0e66d4"  />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
        );
      }}
    /> ) : (<Text style={{color:"white"},{fontSize:20}}>No queues found </Text>) }
  </View>
  );
};


AdminDashboard.navigationOptions = ( {navigation} ) => {
  return {
    headerRight: () => (
      <TouchableOpacity onPress={() => navigation.navigate('CreateQueue')}>
        <Feather  name="plus" size={30} color="#0e66d4" />
      </TouchableOpacity>
    ),
    title: "Hello, " + navigation.getParam("fullName")
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

