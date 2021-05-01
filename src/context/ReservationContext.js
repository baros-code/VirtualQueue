import createDataContext from './createDataContext'
// import { firebase } from '../firebase/config'

//ID LERI RANDOM ATTIRABILIRIZ

const reservationReducer = (state, action) => {
    switch(action.type) {
        case 'fetch_reservations':
            return action.payload;  
        case 'add_reservation':
            const RESERVATION_ID = Math.floor((Math.random() * 100000) + 1);
            return [...state, { id: RESERVATION_ID , clientId: action.payload.clientId, transactionType: action.payload.transactionType, date: action.payload.date, organizationName: action.payload.organizationName} ];
        case 'delete_reservation':
            return state.filter(reservation => reservation.id !== action.payload);
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





