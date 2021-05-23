import React, { useState,useEffect, useContext } from 'react';
import { StyleSheet, View,Text, TextInput,Button} from 'react-native';
import { firebase } from '../firebase/config'
import { AuthContext } from '../Authentication/AuthContext';
import ScrollPickerComponent from "../ExternalComponents/ScrollPickerComponent"
import { Feather } from '@expo/vector-icons'; 
import { addMinutes, isAllowedRemaining,lockTheRemaining, unLockTheRemaining, findSlotInterval, getCurrentDate,compareTwoTime,compareTwoDate, getCurrentTime, isExist } from '../ExternalComponents/DateOperations';


const CreateReservation = ({ navigation, route}) => {

    const { userToken } = useContext(AuthContext);

    const serviceType = route.params.serviceType;
    const organizationId = route.params.organizationId;       //selected organization to enqueue
    const organizationName = route.params.organizationName;    

    //console.log("From CreateReservation: " + userToken.uid, organizationId, organizationName);
  
    const USER_ID = userToken.uid;


    const [queues,setQueues]=useState([])
    const[queueId,setQueueId]=useState("Choose transaction type")
    const [dates, setDates] = useState([]);
    const [times, setTimes] = useState([]);
    const [date, setDate] = useState("Choose Date");
    const [time, setTime] = useState("Choose Time");
    const[transactionPicked,setTransactionPicked]=useState(false)
    const[datePicked,setDatePicked]=useState(false)


    async function removeTimeFromQueue() {
       let ref = await firebase.database().ref('queues/' + queueId + "/dates/" + date);
       await ref.once("value",function (dateSnapShot) {
            dateSnapShot.forEach( (dateAttribute) => {
                let currentTime=dateAttribute.val()
                if (currentTime === time) {
                    let currentKey=dateAttribute.key
                    ref.child(currentKey).remove()
                }
            });
        });

    }
    
    function biggerThanToday(date) {
            let dateFormat=date.split("-")
            let compareDate=dateFormat[0] + "/" + dateFormat[1] + "/" + dateFormat[2]
            //console.log(compareDate)
            let today=getCurrentDate()
            //console.log(today)
            let result=compareTwoDate(compareDate,today,"/")
            return (result === 0 || result === 1)
    }


    function getTransactionType() {
        let type;
        queues.forEach((queue) => {
            if (queue.value === queueId) {
                type=queue.transactionType
            }
        })
        return type
    }


    useEffect(() => {

        async function fetchDatesFromQueue() {
            const queuesDateReference=await firebase.database().ref("queues/" + queueId + "/dates")
                let dates=[]
                await queuesDateReference.once("value",function (datesReference) {
                    datesReference.forEach( dateSnapShot => {
                        let currentDate={}
                        currentDate.value=dateSnapShot.key
                        currentDate.label=dateSnapShot.key
                        if (biggerThanToday(currentDate.value)) {
                            dates.push(currentDate)
                        }
                    });
                   
                })
                setDates(dates)
                setTransactionPicked(true)
    
        }
    
        async function fetchTimesFromDate() {
            const timesReference=await firebase.database().ref("queues/" + queueId + "/dates/" + date)
                let times=[]
                await timesReference.once("value",function (timeReference) {
                    let timesList=timeReference.val()
                    timesList.forEach(time => {
                        let todayTime=getCurrentTime()
                        let currentTime={}
                        //console.log(time)
                        currentTime.value=time
                        currentTime.label=time
                        if (compareTwoTime(todayTime,time) !== 1) {
                            times.push(currentTime)
                        }                       
                    })
                   
                })
                setTimes(times)
                setDatePicked(true)
    
        }
        
        async function fetchOrganizationQueues() {
            let queues=[]
            const queuesReference=await firebase.database().ref("queues/")
            await queuesReference.once("value",function (queuesReference) {
                queuesReference.forEach( dateSnapShot => {
                    let currentDay=dateSnapShot.val()
                    currentDay.value=dateSnapShot.key
                    currentDay.label=currentDay.transactionType
                    let currentOrganizationId=currentDay.organizationId
                    if (currentOrganizationId === organizationId) {
                      queues.push(currentDay)                 
                    }
                });
               
            })
           setQueues(queues)
           
        }



        if (queueId === "Choose transaction type") {
            fetchOrganizationQueues()
        } else if ( date === "Choose Date") {
            fetchDatesFromQueue()
        } else if (time === "Choose Time"){
            fetchTimesFromDate() 
            
        } else { 
            setTime("Choose Time")                      
            fetchDatesFromQueue()
            fetchTimesFromDate() 
        }
        
      },([queueId,date]))



/** 
    const findQueue = async (transactionType) => {
        var ref = await firebase.database().ref("queues");   
        var response;
        await ref.once("value",function (queues) {
          queues.forEach( queue => {
              let currentDay = queue.val();
              currentDay.id = queue.key;
              if(currentDay.organizationId === organizationId && currentDay.transactionType === transactionType) {
                  response = currentDay;
                  return true;      //end forEach
                  //takeValue(response);        herhangi bir methoda argüman olarak verirsek promise dönebiliyor, alternatif return şekli.
              }
          });
      }); 
      return response;
    }
*/
    const addReservation = async () => {
        let allowed=await isAllowedRemaining(0,queueId)
        if (!allowed) {return false};
        await lockTheRemaining(0,queueId);
        await removeTimeFromQueue() 
        let resId=await isExist(queueId,time)
        let ref;
        if (resId !== -1) {
            ref=await firebase.database().ref("reservations/" + resId); 
            await ref.update({
                status:0,
                clientId:USER_ID,               
            })
            navigation.navigate('Home', {screen: 'Dashboard'})
            return true
        }
        let type=getTransactionType()
        ref = await firebase.database().ref("reservations").push();      //push sayesinde unique key'li branch olarak ekliyor.
        let interval=await findSlotInterval(queueId)
        ref.set({
            date: date.split("-").join("/"),
            time:time,
            clientId: USER_ID,
            employeeId: "",
            organizationId: organizationId,
            organizationName: organizationName,
            queueId: queueId,
            status: 0,
            transactionType : type,
            estimatedTime:time,
            startTime: "",
            finishTime:"",
            expectedFinishTime:addMinutes(interval,time),
            latencyTime:""
            })
            await unLockTheRemaining(0,queueId);
            return true          
        
    };

    return (
        <View>
        <Text style={styles.label}>Organization Name:</Text>
        <TextInput editable={false} style={styles.input} value={organizationName} onChangeText={(text) => setOrganizationName(text)} />
        <Text style={styles.label}>Transaction Type:</Text>
        <ScrollPickerComponent style={styles.input}  data={queues} editable={true} selectedValue={queueId} callback={ (value) => setQueueId(value)} />
        
        <View style={styles.datePicker}>   
        {transactionPicked &&
        <View style={styles.pickerStyle}>
        <Feather style={styles.iconStyle} name="calendar" />
        <ScrollPickerComponent style={styles.input2}  data={dates} editable={true} selectedValue={date} callback={  (value) => setDate(value)} />
        </View>
        }
        {datePicked &&
         <View style={styles.pickerStyle}>
         <Feather style={styles.iconStyle} name="clock" />
        <ScrollPickerComponent style={styles.input2}  data={times} editable={true} selectedValue={time} callback={(value) => setTime(value)} />
        </View> 
        }
        </View>
        <View style={styles.button}>
            <Button  title="Save Reservation" onPress={ async () => {
                let checker= await addReservation() 
                while (!checker) {
                    checker=await addReservation()
                }
                navigation.navigate('Home', {screen: 'Dashboard'})
            }} />
        </View>
    </View>
    );

        
};


CreateReservation.navigationOptions = ( ) => {
    return {
      title: 'Create Reservation'
    };
};

const styles = StyleSheet.create({
    input: {    
        fontSize: 18,
        borderWidth: 1,
        borderColor: 'black',
        marginBottom: 15,
        padding: 5,
        margin: 5,
        color: 'white'
    },
    input2: {    
        fontSize: 20,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius:10,
        marginBottom: 15,
        padding: 5,
        margin: 5,
        color: 'white'
    },
    iconStyle: {
        fontSize: 40,
        margin: 15,
        color: 'white'
    },
    label: {
        padding:5,
        fontSize: 20,
        marginBottom: 5,
        marginLeft: 5,
        color: 'white'
    },
    pickerStyle: {
        flexDirection: 'column',
        alignItems: 'center'
    },
    button: {
        alignSelf: 'flex-end',
        marginRight: 10,
        paddingTop: 70
    },
    datePicker: {
        paddingHorizontal:47,
        flexDirection: 'row',
        justifyContent: 'space-between',
    }

})

export default CreateReservation;