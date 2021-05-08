import React, { useState,useEffect } from 'react';
import { View, Text,TextInput, StyleSheet, Button,ScrollView} from 'react-native';
import {firebase} from "../firebase/config"
import ScrollPickerComponent from "../ScrollPickerComponent"

const QueueForm = ( { navigation} ) => {

    const [transactionType, setTransactionType] = useState("");
    const [employee, setEmployee] = useState("Employee option");
    const [latency, setLatency] = useState("");
    const [interval, setInterval] = useState("");
    const [startTime, setstartTime] = useState("");
    const [finishTime, setFinishTime] = useState("");

    const editPage=navigation.getParam("editPage")

    

    const saveQueueHandler= async () => {
        let adminId=navigation.getParam("adminId")
        let queueRef=undefined
        let queueId= navigation.getParam("queueId")
        let organizationId=navigation.getParam("organizationId")
        if (queueId !== "") {
            queueRef=await firebase.database().ref("queues/"+ queueId)
        } else {
        queueRef = await firebase.database().ref("queues").push() //push sayesinde unique key'li branch olarak ekliyor.
        }      
        await queueRef.set({
        adminId: adminId,
        organizationId: organizationId,
        transactionType: transactionType,
        employee: employee,
        latency:latency,
        interval: interval,
        startTime: startTime,
        finishTime: finishTime,
        }); 
        navigation.navigate("AdminDashboard",{uid:adminId})
    }
     
    
  useEffect(() => {
      if (editPage) {
        firebase.database().ref("queues/" + navigation.getParam("queueId"))
         .get().then( (queueData) => {
           queueData=queueData.val()
            setTransactionType(queueData.transactionType)
            setEmployee(queueData.employee)
            setInterval(queueData.interval)
            setstartTime(queueData.startTime)
            setFinishTime(queueData.finishTime)
            setLatency(queueData.latency)
       })
        
      }
    
  },([]))


    return (
    <View>
        <ScrollView>
        <Text style={styles.label}>{editPage ? "Queue Type" : "Enter Queue Type" }</Text>
        <TextInput style={styles.input} editable={!editPage} value={transactionType} onChangeText={(text) => setTransactionType(text)} />
        <Text style={styles.label}>{editPage ? "Set Employee" : "Select the Employee"}</Text>
        <ScrollPickerComponent style={styles.input} editable={true} selectedValue={employee} callback={(value) => setEmployee(value)} />
        <Text style={styles.label}>Enter Latency:</Text>
        <TextInput style={styles.input} value={latency} onChangeText={(latency) => setLatency(latency)} />
        <Text style={styles.label}>Enter Slot Interval:</Text>
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
        marginTop:5,
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