

import { SliderComponent } from "react-native";
import { firebase } from "../firebase/config"



export const isAllowedRemaining= async (resId) => {
    let queueId= await getQueueId(resId)
    const ref=await firebase.database().ref("queues/" + queueId);
    let result=undefined;
    await ref.once("value", queueSnapShot => {
        let data=queueSnapShot.val();
        let remainingFlag=data.remainingIsAllowed;
        result=remainingFlag;
        
    })
    return result
}





export const dateComparison = (r1,r2) => {
    let time1=r1.estimatedTime
    let time2=r2.estimatedTime
    return (compareTwoTime(time1,time2)) }



export const getQueueId = async (resId) => {
    const ref=await firebase.database().ref("reservations/" + resId);
    console.log("ref :" + ref)
    let result=undefined
    await ref.once("value", reservation => {
        let queueId=reservation.val().queueId
        result=queueId
    })
    console.log("queue Id ----:" + result)
    return result
}


export const startRemainingTime = async (reservation) => {
    let resId=reservation.id
    console.log("race condition code")
    console.log("current res" + reservation)
    await latencyChecker(reservation)
    let isStart=await isStarted(resId)
    console.log("is Started:" + isStart)
    if (isStart) {
        let finished=await isFinished(resId)
        console.log("is Finished:" + finished)
        if (finished) { //will be update
            if (await isTakeShort(resId)) {
                console.log("it is short")
                let subtractNumber=await findSubtractNumber(resId)
                console.log("subtract number :" + subtractNumber)
                await otherReservationsOperation(reservation.queueId,reservation.date,subtractNumber,0) 
            }
            await finishReservation(resId)
        } else {
            let timeDiff=await isTakeLong(resId)
            if (timeDiff >= 1) {
                await otherReservationsOperation(reservation.queueId,reservation.date,timeDiff,1)  //increment by 1 minute
            }
        }
    } else {
        let lated=await isLate(resId)
        console.log("lated :" + lated)
        if (lated) {
            await lateOperation(reservation)
        } else {
            let todayTime=getCurrentTime()
            console.log("today :" + todayTime)
            let resTime=await getEstimatedTime(resId)
            console.log("res Time :" + resTime)
            let diff=differenceBetweenTimes(todayTime,resTime)
            console.log("difference:" + diff)
            if (diff >= 1) {
                await otherReservationsOperation(reservation.queueId,reservation.date,diff,1) //increment by 1 minute
            } 

        }
    }
    await unLockTheRemaining(resId)
    
}


export const latencyChecker = async (reservation) => {
    const ref=await firebase.database().ref("reservations/" + reservation.id)
    console.log(ref)
    ref.once("value", reservationSnap => {
        let data=reservationSnap.val()
        let latency=data.latencyTime
        console.log("old latency" + latency);
        if (latency === "") {
            console.log("buraya girmeli")
             calculateLatency(reservation).then((newLatency) => {
                console.log("new latency :" + newLatency)
                ref.update({
                    latencyTime:newLatency
                })
            })
        }
    })
}



export const lockTheRemaining = async (resId) => {
    let queueId=await getQueueId(resId);
    const ref=await firebase.database().ref("queues/" + queueId)
    await ref.update({
        remainingIsAllowed:false // lock the remaining time
        
    })
    console.log("Race condition is locked.")
}

export const unLockTheRemaining = async (resId) => {
    let queueId=await getQueueId(resId);
    const ref=await firebase.database().ref("queues/" + queueId)
    await ref.update({
        remainingIsAllowed:true // lock the remaining time
        
    })
    console.log("Race condition is unlocked.")
}

export const getEstimatedTime = async (resId) => {
    let result=undefined
    const ref=await firebase.database().ref("reservations/" + resId)
    await ref.once("value", (reservation) => {
        let estimate=reservation.val().estimatedTime
        result=estimate
    })
    return result

}
export const differenceBetweenTimes = (time1,time2) => {
    let time1Object=time1.split(":")
    let time2Object=time2.split(":")
    let d1=new Date()
    let d2=new Date()
    d1.setHours(time1Object[0],time1Object[1])
    d2.setHours(time2Object[0],time2Object[1])
    let diff=(d1-d2) / (1000*60)
    let difference= Math.round(diff)
    return difference

}



export const findSubtractNumber = async (resId) => {
    const ref=await firebase.database().ref("reservations/" + resId)
    let result=undefined
    await ref.once("value", (reservation) => {
        let expectedFinishTime=reservation.val().expectedFinishTime
        let finishTime=reservation.val().finishTime
        result=differenceBetweenTimes(expectedFinishTime,finishTime)
    })
    return result
}


function sleep(milliseconds) {
    let timeStart = new Date().getTime();
    while (true) {
      let elapsedTime = new Date().getTime() - timeStart;
      if (elapsedTime > milliseconds) {
        break;
      }
    }
  }



export const findCurrentReservation = async (reservations) => { // karşılaştırma expected(estimated) time ile yapılacak
    reservations.forEach(reservation => {
        sleep(100)
        let id=reservation.id
        remainingExecution(id)
                       
     });

}


export const finishReservation = async (resId) => {
    const ref=await firebase.database().ref("reservations/" + resId)
    await ref.update({
        status:3
    })
}


export const findReservations = async (queueId) => {
        let resList=[]
        const ref=await firebase.database().ref("reservations")
        await ref.once("value", reservations => {
            reservations.forEach((reservation) => {
                    let data=reservation.val()
                    data.id=reservation.key
                    if (data.queueId === queueId) {
                        resList.push(data)
                    }
                     
            })
        })
        return resList
}

export const findCurrent =  (reservations) => {
    let found=false
    let res={}
    let todayTime=getCurrentTime()
    let todayDate=getCurrentDate()
    reservations.sort(function (r1, r2) {return dateComparison(r1,r2)});
    reservations.forEach((reservation) => {
        if (((compareTwoTime(reservation.estimatedTime,todayTime) === -1) || (compareTwoTime(reservation.estimatedTime,todayTime) === 0))
        && compareTwoDate(reservation.date,todayDate,"/") === 0 && reservation.status !== 3) { 
            if (!found) {
                res=reservation
                found=true
            }
    }
    })
    return res
}

export const remainingExecution = async (resId) => {
    let allowed=await isAllowedRemaining(resId)
    if (!allowed) {
        return false
    }
    await lockTheRemaining(resId);
    let queueId=await getQueueId(resId)
    console.log("queue Id" + queueId)
    let reservations=await findReservations(queueId)
    let res=findCurrent(reservations)
    if (res === {}) {
        return false
        unLockTheRemaining(resId)
    }
    console.log("res :" + res)
    await startRemainingTime(res)
    unLockTheRemaining(resId)
    
}


export const lateOperation= async (reservation) => {
    console.log("late operation")
    let nextResId=await findNextReservation(reservation) // finding next reservation
    if (nextResId === -1) {
        return
    }
    console.log("next res Id :" + nextResId)
    const nextRef=await firebase.database().ref("reservations/" + nextResId);
    const currentRef=await firebase.database().ref("reservations/" + reservation.id);
    let estimatedTime=await getEstimatedTime(reservation.id)
    console.log("estimated time :" + estimatedTime)
    let interval=await findSlotInterval(reservation.queueId)
    console.log("slot Interval :" + interval)
    let nextEstimatedTime=addMinutes(interval,estimatedTime)
    console.log("next estimated time :" + interval)
    let currentTime=getCurrentTime()
    await nextRef.update({
        estimatedTime:currentTime, // update next reservation's estimated time
        expectedFinishTime:addMinutes(interval,currentTime)
    })
    await currentRef.update({
        estimatedTime:nextEstimatedTime, // swap operation
        expectedFinishTime:addMinutes(interval,nextEstimatedTime),
        latencyTime:"" // make latency empty to recalculate
    })  
}




export const findNextReservation = async (currentReservation) => {
    let slotInterval=await findSlotInterval(currentReservation.queueId)
    let reservationTime=addMinutes(slotInterval,currentReservation.time)
    let queueId=currentReservation.queueId
    let currentDate=getCurrentDate()
    const ref=await firebase.database().ref("reservations");
    let resId=-1
    await ref.once("value",(reservations) => {
        reservations.forEach((reservation)=> {
            let date=reservation.val().date
            console.log("date : " + date)
            let qId=reservation.val().queueId
            let time=reservation.val().time
            console.log("time : " + time)
            let isToday=(compareTwoDate(date,currentDate,"/") === 0) // whether reservation belongs to today
            console.log("isToday : " + isToday)
            if (isToday && time === reservationTime && qId === queueId) {
                resId=reservation.key 
            }
        })
    })
    return resId
}





export const isFinished= async (resId) => {
    const ref=await firebase.database().ref("reservations/" + resId)
    let result=undefined
    await ref.once("value", (reservation) => {
        let data=reservation.val()
        if (data.finishTime !== "") {
            result= true
        } else {
            result= false
        }
    })
    return result
}



export const isStarted= async (resId) => {
    const ref=await firebase.database().ref("reservations/" + resId)
    let startFlag=undefined
    await ref.once("value", (reservation) => {
        let data=reservation.val()
        if (data.startTime !== "") {
           startFlag=true
        } else {
            startFlag=false
        }
    })
    return startFlag
}




export const otherReservationsOperation = async (queueId,date,number,operationFlag) => {
    const ref=await firebase.database().ref("reservations")   
    await ref.once("value", (reservations) => {
        reservations.forEach(reservation => {
            let reservationData=reservation.val()
            let reservationId=reservation.key 
            if (reservationData.queueId === queueId && reservationData.status !== 2
                && reservationData.date === date) {
                    let estimatedTime=reservationData.estimatedTime
                    let expectedFinishTime=reservationData.expectedFinishTime
                    if (operationFlag === 1) {
                        estimatedTime=addMinutes(number,estimatedTime)
                        expectedFinishTime=addMinutes(number,expectedFinishTime)
                    } else if (operationFlag === 0) {
                        estimatedTime=subtractMinutes(number,estimatedTime)  // estimatedTime must used for subtracting
                        expectedFinishTime=subtractMinutes(number,expectedFinishTime)
                    }                 
                    const ref= firebase.database().ref("reservations/" + reservationId)
                    ref.update({
                        estimatedTime:estimatedTime,
                        expectedFinishTime:expectedFinishTime
                    })
                }
        })
    })
    
}

export const addMinutes =(adding,time) =>{
    let dateObject=new Date()
    let timeList=time.split(":")
    dateObject.setHours(timeList[0],timeList[1],0,0)
    dateObject.setMinutes(dateObject.getMinutes() + adding,0,0)

    return convertMinsToHrsMins(dateObject.getMinutes() + dateObject.getHours() * 60)

}


export const subtractMinutes = (number,time) => {
    let dateObject=new Date()
    let timeList=time.split(":")
    dateObject.setHours(timeList[0],timeList[1],0,0)
    dateObject.setMinutes(dateObject.getMinutes() - number,0,0)
    return convertMinsToHrsMins(dateObject.getMinutes() + dateObject.getHours() * 60)

}

export const isLate= async (resId) => {
    const ref=await firebase.database().ref("reservations/" + resId)
    let result=undefined
    await ref.once("value", (reservation) => {
        let data=reservation.val()
        let latencyTime=data.latencyTime
        let today=getCurrentTime()
        let compareFlag=compareTwoTime(today,latencyTime)
        if (compareFlag === 1) { // if current time is bigger than latency time
            result= true
        } else {
            result= false
        }
    })
    return result
}


export const isTakeLong= async (resId) => {
    const ref=await firebase.database().ref("reservations/" + resId)
    let result=0
    let currentTime=getCurrentTime()
    await ref.once("value", (reservation) => {
        let expectedFinishTime=reservation.val().expectedFinishTime
        if (compareTwoTime(currentTime,expectedFinishTime) === 1) {
           result = differenceBetweenTimes(currentTime,expectedFinishTime)
        }
    })
    return result
    
}

export const isTakeShort= async (resId) => {
    const ref=await firebase.database().ref("reservations/" + resId)
    let result=undefined
    await ref.once("value", (reservation) => {
        let expectedFinishTime=reservation.val().expectedFinishTime
        let finishTime=reservation.val().finishTime
        result= (compareTwoTime(expectedFinishTime,finishTime) === 1)
    })
    return result
}




export const findLatency = async (queueId) => {
    let latency=undefined
    const ref=await firebase.database().ref("queues/" + queueId);
    await ref.once("value", (queueSnapShot) => {
        let queueData=queueSnapShot.val()
        console.log(queueData)
       latency=queueData.latency
    })
    return latency
}


export const findSlotInterval = async (queueId) => {
    let slotInterval=undefined
    const ref=await firebase.database().ref("queues/" + queueId);
    await ref.once("value", (queueSnapShot) => {
        let queueData=queueSnapShot.val()
       slotInterval=queueData.interval
    })
    return slotInterval
}


export const calculateLatency = async (reservation) => {
    let queueId=reservation.queueId
    let latency=await findLatency(queueId)
    console.log("latency" + latency)
    let estimatedTime=reservation.estimatedTime
    let reservationTime=reservation.time
    let compareFlag=compareTwoTime(estimatedTime,reservationTime)
    console.log("compare flag :" + compareFlag)
    let maxTime=undefined
    if (compareFlag === 1) {
        maxTime=estimatedTime
    } else if (compareFlag === -1) {
        maxTime=reservationTime
    }  else {
        maxTime=estimatedTime
    }
    return addMinutes(latency,maxTime)     
}




export const compareTwoTime = (time1,time2) => {
    let dateList1=time1.split(":")
    let dateList2=time2.split(":")
    let d1=new Date()
    let d2=new Date()
    d1.setHours(dateList1[0],dateList1[1],0,0)
    d2.setHours(dateList2[0],dateList2[1],0,0)
    let result=undefined
    if (d1.getTime() > d2.getTime()) {
        result=1
    } else if (d1.getTime() === d2.getTime()) {
        result=0      
    } else {
        result=-1
    }
    return result
}


export const compareTwoDate =(date1,date2,delimeter) => {
    let d1=date1.split(delimeter)
    let d2=date2.split(delimeter)
    let date1Object=new Date(d1[2],d1[1],d1[0],0,0,0);
    let date2Object=new Date(d2[2],d2[1],d2[0],0,0,0); // day -1 olmaz
    let result=undefined
    if (date1Object.getTime() > date2Object.getTime()) {
        result= 1;
    } else if (date1Object.getTime() === date2Object.getTime()) {
        result= 0;        
    } else {
        result=-1;
    }
    return result
}

export const convertMinsToHrsMins = (minutes) => {
    let h = Math.floor(minutes / 60);
    let m = minutes % 60;
    h = h < 10 ? '0' + h : h;
    m = m < 10 ? '0' + m : m;
    return h + ':' + m;
  }


export const compareCurrentDay = (date,time)=> { // if 0 returns, current reservation is found
    let  todayDate=getCurrentDate()
    let todayTime=getCurrentTime()
    if (compareTwoDate(date,todayDate,"/") === 1 ) {
        return 1;

    } else if (compareTwoDate(date,todayDate,"/") === 0) {
       return compareTwoTime(time,todayTime)
    }         
     else {
        return -1;
    }

}

export const getCurrentTime = () => {
    let today=new Date()
    today.setTime(today.getTime() + 3 * 60 * 60 * 1000)
    return convertMinsToHrsMins(today.getMinutes() + today.getHours() * 60)
}

export const getCurrentDate = () => {
    let today=new Date()
    today.setTime(today.getTime() + 3 * 60 * 60 * 1000)
    return today.getDate() + "/" + (today.getMonth() + 1)+ "/" + today.getFullYear()
}