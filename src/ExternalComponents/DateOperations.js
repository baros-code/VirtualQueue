

import { firebase } from "../firebase/config"




export const startRemainingTime = async (reservation) => {
    let resId=reservation.id
    if (await isStarted(resId)) {
        if (await isFinished(resId)) {
            if (await isTakeShort(resId)) {
                let subtractNumber=await findSubtractNumber(reservation)
                await otherReservationsOperation(resId,reservation.queueId,reservation.date,subtractNumber,0) 
            }
        } else {
            if (await isTakeLong(resId)) {
                await otherReservationsOperation(resId,reservation.queueId,reservation.date,1,1)  //increment by 1 minute
            }
        }
    } else {
        if (await isLate(resId)) {
            await lateOperation(reservation)
        } else {
            await otherReservationsOperation(resId,reservation.queueId,reservation.date,1,1)  //increment by 1 minute
        }
    }

}

export const findSubtractNumber = async (resId) => {
    const ref=await firebase.database().ref("reservations/" + resId)
    let result=undefined
    await ref.once("value", (reservation) => {
        let expectedFinishTime=reservation.val().expectedFinishTime
        let finishTime=reservation.val().finishTime
        result=expectedFinishTime -finishTime
    })
    return result
}


export const findCurrentReservation = async (reservations) => { // karşılaştırma expected(estimated) time ile yapılacak
    let currentReservation={}
     reservations.forEach(reservation => {
         let date=reservation.date
         let time=reservation.estimatedTime
         if (compareCurrentDay(date,time) === 0) {
            calculateLatency(reservation).then((latency) => {
            const ref=firebase.database().ref("reservations/" + reservation.id);
            ref.update({
            startTime: "",
            finishTime:"",
            expectedFinishTime:"",
            latencyTime:latency  // estimated ile reservation time maksimumu alınıp hesaplanacak
            })           
         })
         currentReservation=reservation
        }
                
     });
     return currentReservation

}





export const lateOperation= async (reservation) => {
    let nextResId=await findNextReservation(reservation) // finding next reservation
    const nextRef=firebase.database().ref("reservations/" + nextResId);
    const currentRef=firebase.database().ref("reservations/" + reservation.id);
    let interval=findSlotInterval(reservation.queueId)
    const nextEstimatedTime=interval + reservation.estimatedTime
    const currentTime=getCurrentTime()
    nextRef.update({
        estimatedTime:currentTime // update next reservation's estimated time
    })
    currentRef.update({
        estimatedTime:nextEstimatedTime // swap operation
    })  
}




export const findNextReservation = async (currentReservation) => {
    let latency=findLatency(currentReservation.queueId)
    let reservationTime=addMinutes(latency,currentReservation.time)
    let queueId=currentReservation.queueId
    let currentDate=getCurrentDate()
    const ref=firebase.database().ref("reservations");
    let resId=-1
    ref.once("value",(reservations) => {
        reservations.forEach((reservation)=> {
            let date=reservation.val().date
            let qId=reservation.val().queueId
            let time=reservation.val().time
            let isToday=(compareTwoDate(date,currentDate) === 0) // whether reservation belongs to today
            if (isToday && time === reservationTime && qId === queueId) {
                resId=reservation.key 
            }
        })
    })
    return resId
}





export const isFinished= async (resId) => {
    const ref=await firebase.database().ref("reservations/" + resId)
    await ref.once("value", (reservation) => {
        let data=reservation.val()
        if (data.finishTime !== "") {
            return true
        } else {
            return false
        }
    })

}



export const isStarted= async (resId) => {
    const ref=await firebase.database().ref("reservations/" + resId)
    await ref.once("value", (reservation) => {
        let data=reservation.val()
        if (data.startTime !== "") {
            return true
        } else {
            return false
        }
    })
}




export const otherReservationsOperation = async (resId, queueId,date,number,operationFlag) => {
    const ref=await firebase.database().ref("reservations")   
    ref.once("value", (reservations) => {
        reservations.forEach(reservation => {
            let reservationData=reservation.val()
            let reservationId=reservation.key 
            if (reservationId !== resId && reservationData.queueId === queueId && reservationData.status !== 2
                && reservationData.date === date) {
                    let estimatedTime=reservationData.estimatedTime
                    if (operationFlag === 1) {
                        estimatedTime=addMinutes(number,estimatedTime)     
                    } else if (operationFlag === 0) {
                        estimatedTime=subtractMinutes(number,estimatedTime) 
                    }                 
                    const ref= firebase.database().ref("reservations/" + reservationId)
                    ref.update({
                        estimatedTime:estimatedTime
                    })
                }
        })
    })
    
}


export const subtractMinutes = (number,time) => {
    let dateObject=new Date()
    let timeList=time.split(":")
    dateObject.setHours(timeList[0],timeList[1])
    dateObject.setMinutes(dateObject.getMinutes() - number)
    return convertMinsToHrsMins(dateObject.getMinutes() + dateObject.getHours() * 60)

}

export const isLate= async (resId) => {
    const ref=await firebase.database().ref("reservations/" + resId)
    let result=await ref.once("value", (reservation) => {
        let data=reservation.val()
        let latencyTime=data.latencyTime
        let today=getCurrentTime()
        let compareFlag=compareTwoTime(today,latencyTime)
        if (compareFlag === -1) { // if current time is bigger than latency time
            return true
        } else {
            return false
        }
    })
    return result
}


export const isTakeLong= async (resId) => {
    const ref=await firebase.database().ref("reservations/" + resId)
    let currentTime=getCurrentTime()
    await ref.once("value", (reservation) => {
        let expectedFinishTime=reservation.val().expectedFinishTime
        return (compareTwoTime(currentTime,expectedFinishTime) === 1)
    })
    
}

export const isTakeShort= async (resId) => {
    const ref=await firebase.database().ref("reservations/" + resId)
    await ref.once("value", (reservation) => {
        let expectedFinishTime=reservation.val().expectedFinishTime
        let finishTime=reservation.val().finishTime
        return (compareTwoTime(expectedFinishTime,finishTime) === 1)
    })
    
}



export const addMinutes =(adding,time) =>{
    let dateObject=new Date()
    let timeList=time.split(":")
    dateObject.setHours(timeList[0],timeList[1])
    dateObject.setMinutes(dateObject.getMinutes() + adding)
    return convertMinsToHrsMins(dateObject.getMinutes() + dateObject.getHours() * 60)

}

export const findLatency = async (queueId) => {
    let latency=undefined
    const ref=await firebase.database().ref("queues/" + queueId);
    await ref.once("value", (queueSnapShot) => {
        let queueData=queueSnapShot.val()
       latency=queueData.latency
    })
    return latency
}


export const findSlotInterval = async (queueId) => {
    let slotInterval=undefined
    const ref=await firebase.database().ref("queues/" + queueId);
    await ref.once("value", (queueSnapShot) => {
        let queueData=queueSnapShot.val()
       interval=queueData.interval
    })
    return interval
}


export const calculateLatency = async (reservation) => {
    let latency=await findLatency(reservation.queueId)
    let estimatedTime=reservation.estimatedTime
    let reservationTime=reservation.time
    let compareFlag=compareTwoTime(estimatedTime,reservationTime)
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
    if (d1.getTime() > d2.getTime()) {
        return 1;
    } else if (d1.getTime() === d2.getTime()) {
        return 0;        
    } else {
        return -1;
    }
}


export const compareTwoDate =(date1,date2,delimeter) => {
    let d1=date1.split(delimeter)
    let d2=date2.split(delimeter)
    let date1Object=new Date(d1[2],d1[1]-1,d1[0],0,0,0);
    let date2Object=new Date(d2[2],d2[1],d2[0],0,0,0); // day -1 olmaz
    if (date1Object.getTime() > date2Object.getTime()) {
        return 1;
    } else if (date1Object.getTime() === date2Object.getTime()) {
        return 0;        
    } else {
        return -1;
    }
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
    return today.getDate() + "/" + today.getMonth() + "/" + today.getFullYear()
}