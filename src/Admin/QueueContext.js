import createDataContext from '../context/createDataContext'



const queueReducer = (state, action) => {
    //console.log(state);
    switch(action.type) {
        case 'add_queue':
            return [...state, { id:action.payload.id , transactionType: action.payload.transactionType, employee: action.payload.employee, 
                latency: action.payload.latency,interval: action.payload.interval,startTime: action.payload.startTime,finishTime: action.payload.finishTime} ];
        case 'delete_queue':
            return state.filter(queue => queue.id !== action.payload);
        case 'edit_queue':
            return state.map((queue) => {
                return queue.id === action.payload.id ? action.payload : queue;
            })
        case 'add_client':
            return state.map((queue) => {
                return (queue.organizationName === action.payload.organizationName && queue.transactionType === action.transactionType) ? {id: queue.id, transactionType: queue.transactionType, employee: queue.employee, latency: queue.latency, interval: queue.interval, startTime: queue.startTime, finishTime: queue.finishTime, clients: [...queue.clients, action.payload.client] } : queue;
            })
        case 'reset_queue':
            return state.map((queue) => {
                return queue.id === action.payload ? {id: queue.id, transactionType: queue.transactionType, employee: queue.employee, latency: queue.latency, interval: queue.interval, startTime: queue.startTime, finishTime: queue.finishTime, clients: [] } : queue;
            })
        default:
            return state;
    }
};

const addClientToQueue = dispatch => {
    return (organizationName, transactionType, client) => {
        dispatch( {type: 'add_client', payload: {organizationName, transactionType, client} });
        console.log("revvvvvvvvvvvv id: " + client.reservationId);
    };
};


const addQueue = dispatch => {
    return (transactionType,employee, latency,interval, startTime,finishTime, clients, callback) => {
        dispatch( {type: 'add_queue', payload: {organizationName: "AKBANK", transactionType: transactionType, employee: employee, latency: latency, interval: interval, startTime:startTime,finishTime:finishTime, clients: clients}});
        if(callback) {
            callback();
        }
        
    };
};

const deleteQueue = dispatch => {
    return (id) => {
        dispatch( {type: 'delete_queue', payload: id} );
    };
};

const resetQueue = dispatch => {
    return (id) => {
        dispatch( {type: 'reset_queue', payload : id } );
        //dispatch( {type: 'reset_queue', payload : {id: id, transactionType: newtransactionType, employee: newEmployee,latency: latency, interval: interval, startTime:startTime,finishTime:finishTime, clients: [] } } );
    };
};

const editQueue = dispatch => {
    return(id, newtransactionType, newEmployee, latency, interval, startTime,finishTime, clients, callback) => {
        dispatch( {type: 'edit_queue', payload: {id: id, transactionType: newtransactionType, employee: newEmployee,latency: latency, interval: interval, startTime:startTime,finishTime:finishTime, clients: clients}} ); 
        if(callback) {
            callback();
        } 
    };
};




export const { Context, Provider } = createDataContext(
    queueReducer,
    { addQueue, deleteQueue, resetQueue, editQueue, addClientToQueue},
    [{organizationName: "AKBANK",transactionType: 'WITHDRAWAL', employee: 'Kemal Selçuk Kaplan', id: "0", latency:"5", interval: "15",startTime:"9", finishTime:"17", clients: [{id: 155, name: "Baran Ateş", reservationId: 2057},{id: 135, name: "Kemal Selçuk Kaplan", reservationId:4098}] }]
);





