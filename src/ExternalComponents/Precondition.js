
import { firebase } from "../firebase/config"
import { dateComparison, findReservations } from "./DateOperations"





export const getTimeFromPrevious= async (queueId) => {
    let reservations=await findReservations(queueId)
    if (reservations.length === 0) {
        return -1
    }
    reservations.sort((function (r1, r2) {return dateComparison(r1,r2)}))
    let newEstimatedTime=reservations[reservations.length-1].expectedFinishTime
    return newEstimatedTime
}

export const getStatusInterval = () => {
    let status=[]
    let active={value:1,label:"Active"}
    let inactive={value:0,label:"Inactive"}
    status=[active,inactive]
    return status
    
}