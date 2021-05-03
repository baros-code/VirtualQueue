import React, { useState,useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Button, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons'; 
import { firebase } from '../firebase/config'
import { quad } from 'react-native/Libraries/Animated/src/Easing';


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
  <View style={styles.background}>
    <Text>Welcome {navigation.getParam("fullName")}</Text>
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
              <Feather style={styles.icon} name="trash" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => resetQueue(item.id)}>
                <Text style={styles.link}>Delete the queue</Text>
            </TouchableOpacity>
        </TouchableOpacity>
        );
      }}
    /> ) : (<Text>No queues found</Text>) }
  </View>
  );
};


AdminDashboard.navigationOptions = ( {navigation} ) => {
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
  title: {
    fontSize: 18,
    color:"white"
  },
  icon: {
    fontSize: 24,
    color:"white"
  },
  link: {
    color:"red",
    fontSize:20,
    margin:10,
  }
});


export default AdminDashboard;

