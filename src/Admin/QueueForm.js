import React, { useState,useEffect, useContext } from 'react';
import { View, Text,TextInput, StyleSheet, Button,ScrollView} from 'react-native';
import {firebase} from "../firebase/config"
import ScrollPickerComponent from "../ExternalComponents/ScrollPickerComponent"
import { AuthContext } from '../Authentication/AuthContext';
import { getStatusInterval } from '../ExternalComponents/Precondition';

const QueueForm = ( { navigation, route} ) => {

    const [transactionType, setTransactionType] = useState("");
    const [employeeId, setEmployeeId] = useState("Employee Option");
    const [latency, setLatency] = useState("Latency Option");
    const [interval, setInterval] = useState("Slot Interval Option");
    const [startTime, setstartTime] = useState("Start Time Option");
    const [finishTime, setFinishTime] = useState("Finish Time Option");
    const [status, setStatus] = useState("Status Option");


    const editPage= route.params.editPage;
    const [employees,setEmployees]= useState([])

    const { userToken } = useContext(AuthContext);

    const USER_ID = userToken.uid;
    const queueId = route.params.queueId;
    const organizationId = userToken.organizationId;

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
        let employeeLocker;
        let remainingIsAllowed;
        let dates;
        let queueRef=undefined
        if (queueId !== "") {
            queueRef=await firebase.database().ref("queues/"+ queueId)
        } else {
        queueRef = await firebase.database().ref("queues").push() //push sayesinde unique key'li branch olarak ekliyor.        
        }
        if (!editPage) {
            let d=getDates(getReservationTimes())
            dates=d
            remainingIsAllowed=true;
        } else {
            await queueRef.get().then((data) => {
                dates=data.val().dates
                remainingIsAllowed=data.val().remainingIsAllowed
            })
        }
         // adding employee name
        let employeeName=undefined
        let employeeRef=await firebase.database().ref("users/"+ employeeId)
        await employeeRef.get().then((data) => {
            employeeName=data.val().fullName
        })
        await queueRef.set({ 
        status:status,   
        dates:dates,
        adminId: USER_ID,
        organizationId: organizationId,
        transactionType: transactionType,
        employeeId: employeeId,
        employeeName:employeeName,
        latency:latency,
        interval: interval,
        startTime: startTime,
        finishTime: finishTime,
        remainingIsAllowed:remainingIsAllowed
        }); 
        if (!editPage) {
        let reservationTimes=getReservationTimes()
        let dates=getDates(reservationTimes)
        await queueRef.update({dates:dates})
        }
        navigation.navigate("Dashboard")
    }
     
    
  useEffect(() => {

        async function getEmployees() {
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
        firebase.database().ref("queues/" + queueId)
         .get().then( (queueData) => {
           queueData=queueData.val()
            setTransactionType(queueData.transactionType)
            setEmployeeId(queueData.employeeId)
            setInterval(queueData.interval)
            setstartTime(queueData.startTime)
            setFinishTime(queueData.finishTime)
            setLatency(queueData.latency)
            setStatus(queueData.status)
       })
        
      }
      getEmployees()
      
    
  },([]))


    return (
    <View>
        <ScrollView>
        <Text style={styles.label}>{editPage ? "Queue Type" : "Enter Queue Type" }</Text>
        <TextInput style={getStyle(!editPage)} editable={!editPage} value={transactionType} onChangeText={(text) => setTransactionType(text)} />
        <Text style={styles.label}>{editPage ? "Set Employee" : "Select the employee"}</Text>
        <ScrollPickerComponent style={getStyle(true)}  data={employees} editable={true} selectedValue={employeeId} callback={(value) => setEmployeeId(value)} />
        <Text style={styles.label}>{editPage ? "Set Status" : "Select the Status"}</Text>
        <ScrollPickerComponent style={getStyle(true)}  data={getStatusInterval()} editable={true} selectedValue={status} callback={(value) => setStatus(value)} />
        <Text style={styles.label}>{editPage ? "Slot Interval" : "Select the Slot Interval"}</Text>
        <ScrollPickerComponent style={getStyle(!editPage)}  data={getIntervals(5,5," minutes",50)} editable={!editPage} selectedValue={interval} callback={(value) => setInterval(value)} />
        <Text style={styles.label}>{editPage ? "Set Latency" : "Select the latency"}</Text>
        <ScrollPickerComponent style={getStyle(true)}  data={getIntervals(1,1," minutes",interval)} editable={true} selectedValue={latency} callback={(value) => setLatency(value)} />
        <Text style={styles.label}>{editPage ? "Start Time" : "Select the Start Time"}</Text>
        <ScrollPickerComponent style={getStyle(!editPage)}  data={getIntervals(0,1,".00",25)} editable={!editPage} selectedValue={startTime} callback={(value) => setstartTime(value)} />
        <Text style={styles.label}>{editPage ? "Finish Time" : "Select the Finish Time"}</Text>
        <ScrollPickerComponent style={getStyle(!editPage)}  data={getIntervals(0,1,".00",25)} editable={!editPage} selectedValue={finishTime} callback={(value) => setFinishTime(value)} />
        <View style={styles.button}>
            <Button title="Save Queue" onPress= {() => saveQueueHandler()} />
        </View>
        </ScrollView>
    </View>
    );
}




const styles = StyleSheet.create({
    input: {
        borderRadius:5,
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
        borderRadius:5,
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