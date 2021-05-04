import React, { useState } from 'react';
import { View, Text,TextInput, StyleSheet, Button,ScrollView} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import {firebase} from "../firebase/config"

const QueueForm = ( { initialValues,navigation} ) => {

    const [transactionType, settransactionType] = useState(initialValues.transactionType);
    const [employee, setemployee] = useState(initialValues.employee);
    const [latency, setLatency] = useState(initialValues.latency);
    const [interval, setInterval] = useState(initialValues.interval);
    const [startTime, setstartTime] = useState(initialValues.startTime);
    const [finishTime, setFinishTime] = useState(initialValues.finishTime);

    const saveQueueHandler= async () => {
        let adminId=navigation.getParam("id")
        let queueRef=undefined
        let queueId= initialValues.queueId
        if (queueId !== "") {
            queueRef=await firebase.database().ref("queues/"+ queueId)
        } else {
        queueRef = await firebase.database().ref("queues").push() //push sayesinde unique key'li branch olarak ekliyor.
        }      
        await queueRef.set({
        adminId: adminId,
        transactionType: transactionType,
        employee: employee,
        interval: interval,
        startTime: startTime,
        finishTime: finishTime,
        }); 
        navigation.navigate("AdminDashboard",{uid:adminId,currentState:true})  
    }
     

    return (
    <View>
        <ScrollView>
        <Text style={styles.label}>Enter Type:</Text>
        <TextInput style={styles.input} value={transactionType} onChangeText={(text) => settransactionType(text)} />
        <Text style={styles.label}>Enter Employee:</Text>
        <TextInput style={styles.input} value={employee} onChangeText={(employee) => setemployee(employee)} />
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


/*PROPS KOYMAZSAN DEFAULT OLARAK ASAGIDAKILER GIDIYOR.*/

QueueForm.defaultProps = {
    initialValues: {
        transactionType: '',
        employee: '',
        latency:" ",
        interval:" ",
        startTime:" ",
        finishTime:" ",
        queueId:"",

    }
};


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