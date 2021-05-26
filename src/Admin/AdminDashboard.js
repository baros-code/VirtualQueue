import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons'; 
import { firebase } from '../firebase/config'
import { AuthContext } from '../Authentication/AuthContext'; 
import queueLogo from "../../assets/images/queue-512.webp"

const AdminDashboard = ( {navigation} ) => {

  const { userToken } = useContext(AuthContext);

  const USER_ID = userToken.uid;

  const [queues, setQueues] = useState([])

  
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
            <Image source={queueLogo} style={styles.image} />
            <View style={{flexDirection:"column",alignItems:"center"}}>
              <View style={styles.mainInformatin}>
                  <Text style={styles.title1}>{item.transactionType}</Text>                       
              </View>
              <View style={styles.mainInformatin}>
                <View><Feather name="user" size={28} color="#0e66d4" /></View>
                <View><Text style={styles.title2}>{item.employeeName}</Text></View>
              </View>
              <View style={styles.mainInformatin}>
                <Feather name="activity" size={28} color="#0e66d4" />
                <Text style={styles.title3}>{item.status ? <Text style={{color:"green"}}>Active</Text> : <Text style={{color:"red"}}>Inactive</Text>} </Text> 
                
              </View>
            </View>
            <View style={styles.settings}>
              <TouchableOpacity onPress={() => navigation.push("QueueForm", {queueId: item.id}) }>
                          <Feather name="settings" size={32} color="#0e66d4" />
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
  text: {
    color:"white",
    fontSize:25
  },
  row: {
    flex:1,
    flexDirection: 'row',
    paddingVertical: 25,
    backgroundColor:"white",
    marginTop:30,
    borderRadius:25,
    borderColor: 'gray',
  },
  mainInformatin: {
    flexDirection:"row",
    justifyContent:"flex-start",
    marginBottom:15
  },
  title1: {
    justifyContent:"center",
    marginBottom:15,
    marginRight:25,
    textTransform:"uppercase",
    fontSize: 23,
    color:"#0e66d4",
    fontWeight:"bold"
  },
  settings: {
    flex:1,
    flexDirection:"row",
    justifyContent:"flex-end",
    marginRight:20

  },
  queueDetails: {
    flexDirection:"column",
    marginRight:15
  },
  title2: {
    marginLeft:10,
    textTransform:"uppercase",
    fontSize: 20,
    color:"#0e66d4",
    fontWeight:"bold",
    borderRadius:5
  },
  title3: {
    marginLeft:10,
    textTransform:"uppercase",
    fontSize: 20,
    color:"#0e66d4",
    fontWeight:"bold",
    borderRadius:5
  },
  image: {
    resizeMode: "center",
    height: 100,
    width:150,
    borderRadius:10,
    borderColor:"#0e66d4",
  }
});


export default AdminDashboard;

