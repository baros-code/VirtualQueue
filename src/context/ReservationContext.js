import createDataContext from './createDataContext'
import { firebase } from '../firebase/config'

//ID LERI RANDOM ATTIRABILIRIZ

const reservationReducer = (state, action) => {
    switch(action.type) {
        case 'fetch_reservations':
            return action.payload;  
        case 'add_reservation':
            var ref =firebase.database().ref("reservations").push();      //push sayesinde unique key'li branch olarak ekliyor.
            const reservation = action.payload;
            ref.set({
            date: {
                day: reservation.date,
                month: reservation.date,
                year: reservation.date,
                time: reservation.date
            },
            clientId: reservation.clientId,
            employeeId: "userId3",
            estimatedRemainingTimeSec: "300",
            startTime: "14.30",
            finishTime: "14.45",
            organizationId: reservation.organizationName,
            queueId: "queueId2",
            status: "2",
            transactionType: reservation.transactionType
            });
        case 'delete_reservation':
            ref = firebase.database().ref("reservations");   
            ref.child(action.payload).remove();         //if not found exception eklenmeli.
        default:
            return state;
    }
};


// const fetchReservations = dispatch => {
//     return (clientId) => {
//         const ref =firebase.database().ref("reservations");
//         ref.orderByChild("clientId").equalTo(clientId).on("child_added", snapshot => {
//              data = snapshot.val();
//              console.log(data);
//             dispatch({ type: 'fetch_reservations', payload: data });
//         });

//     }
//   };


const addReservation = dispatch => {
    return (clientId, transactionType,date,organizationName,callback) => {
        dispatch( {type: 'add_reservation', payload: {clientId: clientId, transactionType: transactionType, date: date, organizationName: organizationName}});
        if(callback) {
            callback();
        }
        
    };
};

const deleteReservation = dispatch => {
    return (id, callback) => {
        dispatch( {type: 'delete_reservation', payload: id} );
        if(callback) {
            callback();
        }
    };
};



export const { Context, Provider } = createDataContext(
    reservationReducer,
    { addReservation, deleteReservation},
    [{id: 0, clientId: 0, transactionType: 'TEST TYPE', date: 'Mon,29 Mar 2021 06:00:00', organizationName: 'AKBANK' } ]
);





