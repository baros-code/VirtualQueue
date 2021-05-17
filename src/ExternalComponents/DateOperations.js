

import { firebase } from "../firebase/config"


export const findCurrentReservation = async (reservations) => { // karşılaştırma expected(estimated) time ile yapılacak
    let currentReservation={}
     reservations.forEach(reservation => {
         let date=reservation.date
         let time=reservation.estimatedTime
         let comparing= "10:00"
        // if (compareCurrentDay(date,time) === 1) {
        if (compareTwoTime(time,comparing) === 1) {
            calculateLatency(reservation).then((latency) => {
            const ref=firebase.database().ref("reservations/" + reservation.id);
            reservation.startTime= ""
            reservation.finishTime=""
            reservation.expectedFinishTime=""
            reservation.latencyTime=latency  // estimated ile reservation time maksimumu alınıp hesaplanacak
            ref.set(reservation)
            
           // console.log(currentReservation)
         })
         currentReservation=reservation
        }
                
     });
     return currentReservation

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
    d1.setHours(dateList1[0],dateList1[1])
    d2.setHours(dateList2[0],dateList2[1])
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
    let date1Object=new Date(d1[2],d1[1]-1,d1[0]);
    let date2Object=new Date(d2[2],d2[1]-1,d2[0]);
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
    let today=new Date()
    let  todayDate=today.getDay() + "/" + today.getMonth() + "/" + today.getFullYear()
    let todayTime=convertMinsToHrsMins(today.getMinutes())
    if (compareTwoDate(date,todayDate) === 1 && compareTwoTime(time,todayTime) === 1) {
        return 1;

    } else if (compareTwoDate(date,todayDate) === 0 && compareTwoTime(time,todayTime) === 0) {
        return 0;
    } else {
        return -1;
    }

}