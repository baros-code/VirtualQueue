import React, { useState,useEffect, useContext } from 'react';
import { View, Text,TextInput, StyleSheet, Button,ScrollView} from 'react-native';
import {firebase} from "../firebase/config"
import { AuthContext } from '../Authentication/AuthContext';

const QueueForm = ( { navigation, route} ) => {

    const [transactionType, setTransactionType] = useState("");
    const [employee, setEmployee] = useState("");
    const [latency, setLatency] = useState("");
    const [interval, setInterval] = useState("");
    const [startTime, setstartTime] = useState("");
    const [finishTime, setFinishTime] = useState("");

    const { userToken } = useContext(AuthContext);

    const queueId = route.params.queueId;
    const isEditable = route.params.editable;

    const USER_ID = userToken.uid;


    
    const saveQueueHandler= async () => {
        let queueRef=undefined
        if (queueId !== "") {
            queueRef=await firebase.database().ref("queues/"+ queueId)
        } else {
        queueRef = await firebase.database().ref("queues").push() //push sayesinde unique key'li branch olarak ekliyor.
        }      
        await queueRef.set({
        adminId: USER_ID,
        transactionType: transactionType,
        employee: employee,
        latency:latency,
        interval: interval,
        startTime: startTime,
        finishTime: finishTime,
        }); 
        navigation.navigate("AdminDashboard")
    }
     
    
  useEffect(() => {
      if (isEditable) {
        firebase.database().ref("queues/" + queueId)
         .get().then( (queueData) => {
           queueData=queueData.val()
            setTransactionType(queueData.transactionType)
            setEmployee(queueData.employeeName)
            setInterval(queueData.interval.toString())
            setstartTime(queueData.startTime.toString())
            setFinishTime(queueData.finishTime.toString())
            setLatency(queueData.latency.toString())
       })
        
      }
    
  },([]))


    return (
    <View>
        <ScrollView>
        <Text style={styles.label}>Enter Type:</Text>
        <TextInput style={styles.input} value={transactionType} onChangeText={(text) => setTransactionType(text)} />
        <Text style={styles.label}>Enter Employee:</Text>
        <TextInput style={styles.input} value={employee} onChangeText={(employee) => setEmployee(employee)} />
        <Text style={styles.label}>Enter Latency:</Text>
        <TextInput style={styles.input} value={latency} onChangeText={(latency) => setLatency(latency)} />
        <Text style={styles.label}>Enter Interval:</Text>
        <TextInput style={styles.input} value={interval} onChangeText={(interval) => setInterval(interval)} />
        <Text style={styles.label}>Enter Start Time:</Text>
        <TextInput style={styles.input} value={startTime} onChangeText={(startTime) => setstartTime(startTime)} />
        <Text style={styles.label}>Enter Finish Time:</Text>
        <TextInput style={styles.input} value={finishTime} onChangeText={(finishTime) => setFinishTime(finishTime)} />
        <View style={styles.button}>
            <Button title="Save Queue" onPress= {() => saveQueueHandler()} />
        </View>
        </ScrollView>
    </View>
    );
}




const styles = StyleSheet.create({
    input: {
        fontSize: 18,
        borderWidth: 1,
        borderColor: 'black',
        marginBottom: 15,
        padding: 5,
        margin: 5,
        color:"white",
    },
    label: {
        fontSize: 20,
        marginBottom: 5,
        marginLeft: 5,
        color:"white",
    },
    button: {
        alignSelf: 'flex-end',
        marginRight: 10,
        color:"white",
    }
});


export default QueueForm;