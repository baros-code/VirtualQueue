import React, { useState,useEffect } from 'react';
import { View, Text,TextInput, StyleSheet, Button,ScrollView} from 'react-native';
import {firebase} from "../firebase/config"
import ScrollPickerComponent from "../ExternalComponents/ScrollPickerComponent"

const QueueForm = ( { navigation} ) => {

    const [transactionType, setTransactionType] = useState("");
    const [employeeId, setEmployeeId] = useState("Employee Option");
    const [latency, setLatency] = useState("Latency Option");
    const [interval, setInterval] = useState("Slot Interval Option");
    const [startTime, setstartTime] = useState("Start Time Option");
    const [finishTime, setFinishTime] = useState("Finish Time Option");
    const editPage=navigation.getParam("editPage")
    const [employees,setEmployees]= useState([])

    const convertMinsToHrsMins = (mins) => {
        let h = Math.floor(mins / 60);
        let m = mins % 60;
        h = h < 10 ? '0' + h : h;
        m = m < 10 ? '0' + m : m;
        return `${h}:${m}`;
      }

    const getDates =(reservationTimes) => {
        let currentDate=new Date()
        let finishDate=new Date()
        finishDate.setDate(currentDate.getDate() + 7)
        let datesObject={}
        while (currentDate < finishDate) {
            let cDay = currentDate.getDate();
            let cMonth = currentDate.getMonth() + 1;
            let cYear = currentDate.getFullYear();
            let dateString=cDay + "-" + cMonth + "-" + cYear
            datesObject[dateString]=reservationTimes
            currentDate.setDate(currentDate.getDate() + 1)
        }
        return datesObject
    }

    const getReservationTimes=() => {
        let reservationTimes=[]
        let currentTime=startTime*60
        let finalTime=finishTime*60
        while (currentTime < finalTime) {
            reservationTimes.push(convertMinsToHrsMins(currentTime))
            currentTime += interval
        }
        return reservationTimes
    }

    const getIntervals= (current,increment,adding,ending) => {
        let intervals=[]
        let currentInterval=current;
        while (currentInterval < ending) {
            let currentObject={value:currentInterval,label:currentInterval + adding}
            intervals.push(currentObject)
            currentInterval += increment
        }
        return intervals
    }

    const getStyle = (editable) => {
        if (editable) {
            return styles.input
        } else {
            return styles.noInput
        }
    }

    
    const saveQueueHandler= async () => {
        let dates;
        let adminId=navigation.getParam("adminId")
        let queueRef=undefined
        let queueId= navigation.getParam("queueId")
        let organizationId=navigation.getParam("organizationId")
        if (queueId !== "") {
            queueRef=await firebase.database().ref("queues/"+ queueId)
        } else {
        queueRef = await firebase.database().ref("queues").push() //push sayesinde unique key'li branch olarak ekliyor.        
        }
        if (!editPage) {
            let d=getDates(getReservationTimes())
            dates=d
        } else {
            await queueRef.get().then((data) => {
                dates=data.val().dates
            })
        }
         // adding employee name
        let employeeName=undefined
        let employeeRef=await firebase.database().ref("users/"+ employeeId)
        await employeeRef.get().then((data) => {
            employeeName=data.val().fullName
        })
        await queueRef.set({    
        dates:dates,
        adminId: adminId,
        organizationId: organizationId,
        transactionType: transactionType,
        employeeId: employeeId,
        employeeName:employeeName,
        latency:latency,
        interval: interval,
        startTime: startTime,
        finishTime: finishTime,
        }); 
        if (!editPage) {
        let reservationTimes=getReservationTimes()
        let dates=getDates(reservationTimes)
        await queueRef.update({dates:dates})
        }
        navigation.navigate("AdminDashboard",{uid:adminId})
    }
     
    
  useEffect(() => {

        async function getEmployees() {
            let organizationId=navigation.getParam("organizationId")
            let employeesList=[]
            const usersReference=await firebase.database().ref("users/")
            await usersReference.once("value",function (usersSnapShot) {
                usersSnapShot.forEach( userSnapShot => {
                    let currentUser=userSnapShot.val()
                    currentUser.value=userSnapShot.key
                    currentUser.label=currentUser.fullName
                    let currentOrganizationId=currentUser.organizationId
                    if ((currentOrganizationId === organizationId) && (currentUser.role === 1)) {
                      employeesList.push(currentUser)                 
                    }
                });
               
            })
           setEmployees(employeesList)
        }

      if (editPage) {
        firebase.database().ref("queues/" + navigation.getParam("queueId"))
         .get().then( (queueData) => {
           queueData=queueData.val()
            setTransactionType(queueData.transactionType)
            setEmployeeId(queueData.employeeId)
            setInterval(queueData.interval)
            setstartTime(queueData.startTime)
            setFinishTime(queueData.finishTime)
            setLatency(queueData.latency)
       })
        
      }
      getEmployees()
      
    
  },([]))


    return (
    <View>
        <ScrollView>
        <Text style={styles.label}>{editPage ? "Queue Type" : "Enter Queue Type" }</Text>
        <TextInput style={getStyle(!editPage)} editable={!editPage} value={transactionType} onChangeText={(text) => setTransactionType(text)} />
        <Text style={styles.label}>{editPage ? "Set employee" : "Select the employee"}</Text>
        <ScrollPickerComponent style={getStyle(true)}  data={employees} editable={true} selectedValue={employeeId} callback={(value) => setEmployeeId(value)} />
        <Text style={styles.label}>{editPage ? "Slot Interval" : "Select the Slot Interval"}</Text>
        <ScrollPickerComponent style={getStyle(!editPage)}  data={getIntervals(5,5," minutes",50)} editable={!editPage} selectedValue={interval} callback={(value) => setInterval(value)} />
        <Text style={styles.label}>{editPage ? "Set Latency" : "Select the latency"}</Text>
        <ScrollPickerComponent style={getStyle(true)}  data={getIntervals(1,1," minutes",16)} editable={true} selectedValue={latency} callback={(value) => setLatency(value)} />
        <Text style={styles.label}>{editPage ? "Start Time" : "Select the Start Time"}</Text>
        <ScrollPickerComponent style={getStyle(!editPage)}  data={getIntervals(8,1,".00",18)} editable={!editPage} selectedValue={startTime} callback={(value) => setstartTime(value)} />
        <Text style={styles.label}>{editPage ? "Finish Time" : "Select the Finish Time"}</Text>
        <ScrollPickerComponent style={getStyle(!editPage)}  data={getIntervals(8,1,".00",18)} editable={!editPage} selectedValue={finishTime} callback={(value) => setFinishTime(value)} />
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
        borderColor: 'white',
        marginBottom: 15,
        padding: 5,
        margin: 5,
        color:"#0e66d4",
        backgroundColor:"white",
        opacity:1
    },
    noInput: {
        fontSize: 18,
        borderWidth: 1,
        borderColor: 'white',
        marginBottom: 15,
        padding: 5,
        margin: 5,
        color:"#0e66d4",
        opacity: 0.5,
        backgroundColor:"white"
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